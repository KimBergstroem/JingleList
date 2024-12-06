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

    const { title, description, price, url, priority, wishlistId } =
      await request.json()

    if (!wishlistId) {
      return NextResponse.json(
        { error: "Wishlist must be specified" },
        { status: 400 }
      )
    }

    // Verify that the wishlist belongs to the user
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId: String(session.userId),
      },
    })

    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    const item = await prisma.wishlistItem.create({
      data: {
        title,
        description,
        price,
        url,
        priority,
        wishlistId,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error creating wishlist item:", error)
    return NextResponse.json(
      { error: "Could not add the item" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get("id")

  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
  }

  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify that the item exists and belongs to the user's wishlist
    const item = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlist: {
          userId: String(session.userId),
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Delete the item
    await prisma.wishlistItem.delete({
      where: {
        id: itemId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting wishlist item:", error)
    return NextResponse.json(
      { error: "Could not delete the item" },
      { status: 500 }
    )
  }
}
