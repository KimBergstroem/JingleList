import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, cancel = false } = await request.json()

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID must be provided" },
        { status: 400 }
      )
    }

    // Get the item and check if it belongs to the current user
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: {
        wishlist: true,
        purchasedByUser: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Don't allow the wishlist owner to mark their own items as purchased
    if (item.wishlist.userId === session.userId) {
      return NextResponse.json(
        { error: "Cannot mark your own items as purchased" },
        { status: 403 }
      )
    }

    // Only allow the original purchaser to cancel
    if (cancel && item.purchasedBy !== session.userId) {
      return NextResponse.json(
        { error: "Only the original purchaser can cancel" },
        { status: 403 }
      )
    }

    // Update the item
    const updatedItem = await prisma.wishlistItem.update({
      where: { id: itemId },
      data: {
        purchased: !cancel,
        purchasedBy: cancel ? null : session.userId,
      },
      include: {
        purchasedByUser: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating item purchase status:", error)
    return NextResponse.json(
      { error: "Could not update item" },
      { status: 500 }
    )
  }
}
