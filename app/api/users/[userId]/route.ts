import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

type Params = { userId: string }

export async function GET(
  _req: Request,
  context: { params: Promise<Params> }
): Promise<Response> {
  try {
    const resolvedParams = await context.params
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.userId },
      select: {
        name: true,
        image: true,
        wishlists: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            description: true,
            occasion: true,
            createdAt: true,
            updatedAt: true,
            items: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                url: true,
                priority: true,
                purchased: true,
                purchasedBy: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Could not fetch user profile" },
      { status: 500 }
    )
  }
}
