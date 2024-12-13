import { unstable_cache } from "next/cache"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

export const revalidate = 60
export const dynamic = "force-dynamic"

const getCachedWishlists = unstable_cache(
  async (userId: string | undefined) => {
    return prisma.wishlist.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: {
        userId: userId ? { not: userId } : undefined,
      },
      select: {
        id: true,
        occasion: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        items: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            price: true,
            purchased: true,
            purchasedBy: true,
            description: true,
            purchasedByUser: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: { items: true },
        },
      },
    })
  },
  ["public-wishlists"],
  { revalidate: 60 }
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)
    const currentUserId = session?.userId
    const wishlists = await getCachedWishlists(currentUserId as string)

    const sanitizedWishlists = wishlists.map((wishlist) => ({
      ...wishlist,
      items: wishlist.items.map((item) => ({
        ...item,
        description: item.description || null,
        purchasedByUser: item.purchasedByUser || null,
      })),
    }))

    return NextResponse.json(sanitizedWishlists)
  } catch (error) {
    console.error("Error fetching public wishlists:", error)
    return NextResponse.json(
      { error: "Could not fetch wishlists" },
      { status: 500 }
    )
  }
}
