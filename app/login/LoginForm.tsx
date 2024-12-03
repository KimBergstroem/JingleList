"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, {
    errors: {
      email: [],
      password: [],
    },
  });

  return (
    <form action={loginAction} className="flex max-w-[300px] flex-col gap-2">
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
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className="btn btn-accent">
      Login
    </button>
  );
}
