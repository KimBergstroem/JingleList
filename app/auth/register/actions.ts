"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { z } from "zod"

import { prisma } from "@/lib/db"

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
  name: z.string().trim().optional(),
})

type RegisterState = {
  errors?: {
    email?: string[]
    password?: string[]
    name?: string[]
  }
}

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const result = registerSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password, name } = result.data

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
