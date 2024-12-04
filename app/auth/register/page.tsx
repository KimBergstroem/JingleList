import Link from "next/link"

import { createCsrfToken } from "@/app/lib/csrf"

import { RegisterForm } from "./RegisterForm"

export default async function Register() {
  const csrfToken = await createCsrfToken()

  return (
    <>
      <div className="container-wrapper">
        <h1 className="mb-4 text-4xl font-bold">Register</h1>
        <RegisterForm csrfToken={csrfToken} />
        <p className="mt-4 text-sm text-gray-500">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </>
  )
}
