import "server-only"

import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })

  ;(await cookies()).set("session", session, {
    httpOnly: true, // Cant be accessed by JavaScript
    secure: true, // Only send the cookie over HTTPS
    sameSite: "lax", // Protect against CSRF
    expires: expiresAt,
  })
}

export async function deleteSession() {
  ;(await cookies()).delete("session")
}

type SessionPayload = {
  userId: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  if (!session) {
    return null
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch {
    return null
  }
}
