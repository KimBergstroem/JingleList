import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { validateWishlistItemForm } from "@/lib/utils/form-validation"
import { decrypt } from "@/app/lib/session"

export async function PATCH(request: NextRequest) {
  try {
    const itemId = request.nextUrl.pathname.split("/").pop()
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate the request data
    const validationResult = validateWishlistItemForm(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid item data", details: validationResult.errors },
        { status: 400 }
      )
    }

    // Verify that the user owns the item
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { wishlist: true },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.wishlist.userId !== session.userId) {
      return NextResponse.json(
        { error: "Not authorized to update this item" },
        { status: 403 }
      )
    }

    // Update the item
    const updatedItem = await prisma.wishlistItem.update({
      where: { id: itemId },
      data: {
        title: validationResult.data.title,
        description: validationResult.data.description,
        price: validationResult.data.price,
        url: validationResult.data.url,
        priority: validationResult.data.priority,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json(
      { error: "Could not update the item" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const itemId = request.nextUrl.pathname.split("/").pop()
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify that the user owns the item
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { wishlist: true },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.wishlist.userId !== session.userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this item" },
        { status: 403 }
      )
    }

    // Delete the item
    await prisma.wishlistItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json(
      { error: "Could not delete the item" },
      { status: 500 }
    )
  }
}
