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

    const { wishlistId, title, description, price } = await request.json()

    const item = await prisma.wishlistItem.create({
      data: {
        title,
        description,
        price,
        wishlistId,
        purchased: true,
        purchasedBy: String(session.userId),
        isExternal: true,
      },
      include: {
        purchasedByUser: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error creating external item:", error)
    return NextResponse.json(
      { error: "Could not add the external item" },
      { status: 500 }
    )
  }
}
