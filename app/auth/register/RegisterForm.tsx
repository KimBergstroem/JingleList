"use client"

import { useActionState } from "react"

import { register } from "./actions"

export function RegisterForm() {
  const [state, registerAction] = useActionState(register, {
    errors: {
      email: [],
      password: [],
      name: [],
    },
  })

  return (
    <form action={registerAction} className="flex max-w-[300px] flex-col gap-2">
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
