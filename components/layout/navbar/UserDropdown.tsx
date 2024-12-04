"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { ProfileIcon } from "@/components/ui/icons"

type UserData = {
  name: string | null
  email: string
  image: string | null
}

export default function UserDropdown({ userId }: { userId: string }) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Could not fetch user data")
        }
        const data = await response.json()
        setUserData(data.user)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }
    loadUserData()
  }, [userId, router])

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="avatar btn btn-circle btn-ghost"
      >
        <div className="w-10 rounded-full">
          {userData?.image ? (
            <Image
              src={userData.image}
              alt="Profile picture"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral text-neutral-content">
              <ProfileIcon />
            </div>
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/profile/settings">Settings</Link>
        </li>
      </ul>
    </div>
  )
}
