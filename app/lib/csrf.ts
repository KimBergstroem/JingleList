import { cookies } from "next/headers"
import Tokens from "csrf"

const tokens = new Tokens()

export async function createCsrfToken() {
  const secret = tokens.secretSync()
  const token = tokens.create(secret)

  ;(await cookies()).set("csrf_secret", secret, {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: true, // Ensure the cookie is only sent over HTTPS
    sameSite: "strict", // Prevent CSRF attacks by restricting the cookie to the same origin
  })

  return token
}

export async function validateCsrfToken(token: string) {
  const secret = (await cookies()).get("csrf_secret")?.value

  if (!secret) {
    return false
  }

  return tokens.verify(secret, token)
}
