import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { decrypt } from "@/app/lib/session"

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  image: z.string().nullable(),
})

type SessionPayload = {
  userId: string
  expiresAt: string
  iat: number
  exp: number
}

async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("session")?.value
  const payload = await decrypt(token)
  return payload as SessionPayload | null
}

export async function GET() {
  const session = await getSession()

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getSession()

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedFields = updateProfileSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid data. Check your details." },
        { status: 400 }
      )
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        image: validatedFields.data.image,
      },
    })

    // Return the updated user (without password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Could not update profile. Try again." },
      { status: 500 }
    )
  }
}
