"use client"

import Link from "next/link"

import { logout } from "@/app/features/auth/login/actions"

import UserDropdown from "./UserDropdown"

type NavbarActionsProps = {
  userId: string | undefined
}

export default function NavbarActions({ userId }: NavbarActionsProps) {
  return (
    <div className="navbar-end">
      {userId ? (
        <div className="flex items-center gap-2">
          <button onClick={() => logout()} className="btn btn-ghost">
            Logout
          </button>
          <UserDropdown userId={userId} />
        </div>
      ) : (
        <Link href="/features/auth/login" className="btn btn-ghost">
          Login
        </Link>
      )}
    </div>
  )
}
