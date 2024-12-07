import Link from "next/link"

import { LoginForm } from "./LoginForm"

export default function Login() {
  return (
    <>
      <div className="container-wrapper my-8 sm:my-12">
        <h1 className="mb-6 text-4xl font-bold">Login</h1>
        <LoginForm />
        <p className="mt-6 text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register">Register</Link>
        </p>
      </div>
    </>
  )
}
