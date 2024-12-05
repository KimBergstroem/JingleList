import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

// Hämta alla önskelistor för inloggad användare
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
      { error: "Kunde inte hämta önskelistor" },
      { status: 500 }
    )
  }
}

// Skapa ny önskelista
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
      return NextResponse.json(
        { error: "Titel är obligatoriskt" },
        { status: 400 }
      )
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
      { error: "Kunde inte skapa önskelistan" },
      { status: 500 }
    )
  }
}
