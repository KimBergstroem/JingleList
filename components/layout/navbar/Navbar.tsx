"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { MenuIcon } from "@/components/ui/icons"
import SearchBar from "@/components/ui/SearchBar"
import ToggleTheme from "@/components/ui/ToggleTheme"

import NavbarActions from "./NavbarActions"

type NavLink = {
  href: string
  label: string
  labelWhenLoggedOut?: string
  requiresAuth?: boolean
  prefetch: boolean
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Browse", labelWhenLoggedOut: "Home", prefetch: true },
  { href: "/about", label: "About", prefetch: false },
]

export default function Navbar() {
  const [session, setSession] = useState<{ userId: string } | null>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  async function getSession() {
    try {
      const response = await fetch("/api/users/me")
      if (response.ok) {
        const data = await response.json()
        setSession({ userId: data.user.id })
      } else {
        setSession(null)
      }
    } catch (error) {
      console.error("Failed to get session:", error)
      setSession(null)
    }
  }

  useEffect(() => {
    getSession()
  }, [pathname])

  const handleNavigation = (href: string) => {
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
    router.push(href)
  }

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <details ref={detailsRef} className="dropdown">
          <summary role="button" className="btn btn-circle btn-ghost">
            <MenuIcon />
          </summary>
          <ul className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            <li className="menu-title font-bold">JingleList</li>
            {NAV_LINKS.map((link) =>
              !link.requiresAuth || session?.userId ? (
                <li key={link.href}>
                  <a onClick={() => handleNavigation(link.href)}>
                    {session?.userId
                      ? link.label
                      : link.labelWhenLoggedOut || link.label}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </details>
      </div>
      <div className="navbar-center hidden sm:flex">
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
