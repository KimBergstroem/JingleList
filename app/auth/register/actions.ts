"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { validateCsrfToken } from "@/app/lib/csrf"
import { rateLimit } from "@/app/lib/rate-limit"

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
  name: z.string().trim().optional(),
  csrf_token: z.string(),
})

type RegisterState = {
  errors?: {
    email?: string[]
    password?: string[]
    name?: string[]
    _form?: string[]
  }
}

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // Rate limiting
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
  const isAllowed = rateLimit(`register_${ip}`, 5) // 5 attempts per minute

  if (!isAllowed) {
    return {
      errors: {
        _form: ["Too many attempts. Please try again later."],
      },
    }
  }

  const result = registerSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password, name, csrf_token } = result.data

  // Validate CSRF token
  const isValidCsrfToken = await validateCsrfToken(csrf_token)
  if (!isValidCsrfToken) {
    return {
      errors: {
        _form: ["Invalid form submission"],
      },
    }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user in the database
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    redirect("/auth/login")
  } catch {
    return {
      errors: {
        email: ["Email already in use"],
      },
    }
  }

  return {
    errors: {
      email: [],
      password: [],
      name: [],
    },
  }
}
