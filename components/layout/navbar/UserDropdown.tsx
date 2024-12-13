"use client"

import { useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { ProfileIcon } from "@/components/ui/icons"
import { useUser } from "@/app/features/profile/hooks/useUser"

export default function UserDropdown({ userId }: { userId: string }) {
  const { user } = useUser()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const router = useRouter()

  if (!userId) return null

  const handleNavigation = (href: string) => {
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
    router.push(href)
  }

  return (
    <details ref={detailsRef} className="dropdown dropdown-end">
      <summary role="button" className="avatar btn btn-circle btn-ghost">
        <div className="size-10 overflow-hidden rounded-full">
          {user?.image ? (
            <Image
              src={user.image}
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
}
