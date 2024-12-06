import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

type WishlistItem = {
  id: string
  title: string
  description: string | null
  price: number | null
  url: string | null
  createdAt: Date
  wishlist: {
    title: string
    user: {
      name: string | null
    }
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const session = await decrypt(sessionToken)

    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const purchasedItems = await prisma.wishlistItem.findMany({
      where: {
        purchasedBy: session.userId,
        purchased: true,
      },
      include: {
        wishlist: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    const formattedItems = purchasedItems.map((item: WishlistItem) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      url: item.url,
      wishlistTitle: item.wishlist.title,
      ownerName: item.wishlist.user.name ?? "Okänd användare",
      createdAt: item.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error("[PURCHASES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
