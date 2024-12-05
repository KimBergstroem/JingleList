import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

// Lägg till nytt item i önskelista
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
        { error: "Önskelista måste anges" },
        { status: 400 }
      )
    }

    // Verifiera att önskelistan tillhör användaren
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId: String(session.userId),
      },
    })

    if (!wishlist) {
      return NextResponse.json(
        { error: "Önskelistan hittades inte" },
        { status: 404 }
      )
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
      { error: "Kunde inte lägga till objektet" },
      { status: 500 }
    )
  }
}
