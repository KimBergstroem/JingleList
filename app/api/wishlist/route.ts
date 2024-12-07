import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

// Fetch all wishlists for the logged-in user
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: String(session.userId),
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(wishlists)
  } catch (error) {
    console.error("Error fetching wishlists:", error)
    return NextResponse.json(
      { error: "Could not fetch wishlists" },
      { status: 500 }
    )
  }
}

// Create a new wishlist
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, occasion } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        title,
        description,
        occasion: occasion || "Other",
        userId: String(session.userId),
      },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error creating wishlist:", error)
    return NextResponse.json(
      { error: "Could not create the wishlist" },
      { status: 500 }
    )
  }
}

// Delete Wishlist
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const wishlistId = searchParams.get("id")

    if (!wishlistId) {
      return NextResponse.json(
        { error: "Wishlist ID is required" },
        { status: 400 }
      )
    }

    // Kontrollera att wishlisten tillhör användaren
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
      select: { userId: true },
    })

    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    if (wishlist.userId !== session.userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this wishlist" },
        { status: 403 }
      )
    }

    // Använd en transaktion för att ta bort både items och wishlist
    await prisma.$transaction([
      // Först ta bort alla items
      prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlistId,
        },
      }),
      // Sedan ta bort wishlisten
      prisma.wishlist.delete({
        where: {
          id: wishlistId,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting wishlist:", error)
    return NextResponse.json(
      { error: "Could not delete the wishlist" },
      { status: 500 }
    )
  }
}
