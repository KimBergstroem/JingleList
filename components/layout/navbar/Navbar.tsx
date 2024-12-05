import { cookies } from "next/headers"
import Link from "next/link"

import { MenuIcon } from "@/components/ui/icons"
import SearchBar from "@/components/ui/SearchBar"
import ToggleTheme from "@/components/ui/ToggleTheme"
import { decrypt } from "@/app/lib/session"

import NavbarActions from "./NavbarActions"

type Session = {
  userId: string
} | null

type NavLink = {
  href: string
  label: string
  requiresAuth?: boolean
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Homepage" },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
  { href: "/about", label: "About" },
]

async function getSession(): Promise<Session> {
  const cookie = (await cookies()).get("session")?.value
  return (await decrypt(cookie)) as Session
}

export default async function Navbar() {
  const session = await getSession()

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <MenuIcon />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            {NAV_LINKS.map((link) =>
              !link.requiresAuth || session?.userId ? (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost text-xl">
          JingleList
        </Link>
      </div>

      <NavbarActions userId={session?.userId} />
      <SearchBar />
      <ToggleTheme />
    </div>
  )
}
