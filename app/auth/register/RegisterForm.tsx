"use client"

import { useFormState } from "react-dom"

import { register } from "./actions"

type RegisterState = {
  errors?: {
    email?: string[]
    password?: string[]
    name?: string[]
    _form?: string[]
  }
}

const initialState: RegisterState = {
  errors: {
    email: [],
    password: [],
    name: [],
  },
}

export function RegisterForm() {
  const [state, formAction] = useFormState(register, initialState)

  return (
    <form action={formAction} className="flex max-w-[300px] flex-col gap-2">
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
