import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [], wishlists: [] })
    }

    const [users, wishlists] = await Promise.all([
      prisma.user.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
        take: 5,
      }),
      prisma.wishlist.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              user: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          occasion: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 5,
      }),
    ])

    return NextResponse.json({ users, wishlists })
  } catch (error) {
    console.error("[SEARCH]", error)
    return NextResponse.json(
      { error: "Kunde inte utföra sökningen" },
      { status: 500 }
    )
  }
}
