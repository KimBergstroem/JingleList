import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        name: true,
        image: true,
        wishlists: {
          select: {
            id: true,
            title: true,
            occasion: true,
            items: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Användaren hittades inte" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Fel vid hämtning av användarprofil:", error)
    return NextResponse.json(
      { error: "Kunde inte hämta användarprofilen" },
      { status: 500 }
    )
  }
}
