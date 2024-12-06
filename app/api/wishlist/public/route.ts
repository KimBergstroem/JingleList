import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

export async function GET() {
  try {
    // Get current logged in user
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)
    const currentUserId = session?.userId

    const wishlists = await prisma.wishlist.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        // Exclude current user's wishlists
        userId: currentUserId
          ? {
              not: String(currentUserId),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
          },
        },
      },
    })

    return NextResponse.json(wishlists)
  } catch (error) {
    console.error("Error fetching public wishlists:", error)
    return NextResponse.json(
      { error: "Could not fetch wishlists" },
      { status: 500 }
    )
  }
}
