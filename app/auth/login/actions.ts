"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { rateLimit } from "@/app/lib/rate-limit"
import { createSession, deleteSession } from "@/app/lib/session"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
})

type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Rate limiting
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
  const isAllowed = rateLimit(`login_${ip}`, 3) // 3 attempts per minute

  if (!isAllowed) {
    return {
      errors: {
        _form: ["Too many login attempts. Please try again in 5 minutes."],
      },
    }
  }

  const result = loginSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password } = result.data

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    }
  }

  await createSession(user.id)

  redirect("/")

  return {
    errors: {
      email: [],
      password: [],
    },
  }
}

export async function logout() {
  await deleteSession()
  redirect("/auth/login")
}
