"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { toast } from "react-hot-toast"

import { ProfileIcon } from "@/components/ui/icons"

import { ShoppingList } from "./ShoppingList"

type UserData = {
  name: string | null
  email: string
  image: string | null
}

export function ProfileInfo() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await fetch("/api/users/me", {
          credentials: "include",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Could not retrieve user data")
        }

        const data = await response.json()
        setUserData(data.user)
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not load user data"
        )
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    toast.error("No user data found")
    return null
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="avatar">
          {userData.image ? (
            <div className="w-24 rounded-full">
              <Image
                src={userData.image}
                alt="Profile picture"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="w-24 rounded-full bg-neutral text-neutral-content">
              <ProfileIcon />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {userData.name || "No name provided"}
          </h2>
          <p className="text-base-content/70">{userData.email}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="divider" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Name</span>
          </label>
          <input
            type="text"
            value={userData.name || ""}
            className="input input-bordered"
            disabled
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            value={userData.email}
            className="input input-bordered"
            disabled
          />
        </div>
      </div>

      {/* Shopping List */}
      <div className="divider" />
      <ShoppingList />
    </div>
  )
}
