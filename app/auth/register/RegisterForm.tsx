"use client"

import { useActionState } from "react"

import { register } from "./actions"

type Props = {
  csrfToken: string
}

export function RegisterForm({ csrfToken }: Props) {
  const [state, registerAction] = useActionState(register, {
    errors: {
      email: [],
      password: [],
      name: [],
    },
  })

  return (
    <form action={registerAction} className="flex max-w-[300px] flex-col gap-2">
      <input type="hidden" name="csrf_token" value={csrfToken} />

      {state?.errors?._form && (
        <p className="text-red-500">{state.errors._form}</p>
      )}

      <div className="flex flex-col gap-2">
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && (
        <p className="text-red-500">{state.errors.name}</p>
      )}

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
      <button type="submit" className="btn btn-accent">
        Register
      </button>
    </form>
  )
}
