"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "react-hot-toast"

import { login } from "./actions"

export function LoginForm() {
  const [state, loginAction] = useActionState(login, {
    errors: {
      email: [],
      password: [],
    },
  })

  const handleSubmit = async (formData: FormData) => {
    const result = await loginAction(formData)
    if (!result?.errors?.email?.length && !result?.errors?.password?.length) {
      toast.success("Successfully logged in!")
    }
  }

  return (
    <form action={handleSubmit} className="flex max-w-[300px] flex-col gap-2">
      <div className="flex flex-col gap-2">
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

      <div className="flex flex-col gap-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit" className="btn btn-accent">
      Login
    </button>
  )
}
