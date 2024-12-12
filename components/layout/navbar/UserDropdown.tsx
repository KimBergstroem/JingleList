"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import { ProfileIcon } from "@/components/ui/icons"

type UserData = {
  name: string | null
  email: string
  image: string | null
}

export default function UserDropdown({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const loadUserData = useCallback(async () => {
    if (!userId) {
      setUserData(null)
      return
    }

    try {
      const response = await fetch("/api/users/me", {
        credentials: "include",
      })
      if (!response.ok) {
        setUserData(null)
        return
      }
      const data = await response.json()
      setUserData(data.user)
    } catch (error) {
      setUserData(null)
      console.error("Could not load user data", error)
    }
  }, [userId])

  useEffect(() => {
    loadUserData()
  }, [userId, pathname, loadUserData])

  if (!userId) return null

  return (
    <details ref={detailsRef} className="dropdown dropdown-end">
      <summary role="button" className="avatar btn btn-circle btn-ghost">
        <div className="size-10 overflow-hidden rounded-full">
          {userData?.image ? (
            <Image
              src={userData.image}
              alt="Profile picture"
              width={40}
              height={40}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral text-neutral-content">
              <ProfileIcon />
            </div>
          )}
        </div>
      </summary>
      <ul className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
        <li>
          <a onClick={() => handleNavigation("/features/profile")}>Profile</a>
        </li>
        <li>
          <a onClick={() => handleNavigation("/features/whishlist")}>
            My Whishlist
          </a>
        </li>
        <li>
          <a onClick={() => handleNavigation("/features/profile/settings")}>
            Settings
          </a>
        </li>
      </ul>
    </details>
  )

  function handleNavigation(href: string) {
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
    router.push(href)
  }
}
