"use client"

import { Suspense, useEffect, useState } from "react"
import { toast } from "react-hot-toast"

import type { UserData } from "../types"
import { ProfileDetails } from "./ProfileDetails"
import { ProfileSkeleton } from "./ProfileSkeleton"
import { ShoppingList } from "./ShoppingList"

export function ProfileInfo() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadUserData() {
      try {
        const response = await fetch("/api/users/me")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Could not retrieve user data")
        }

        if (isMounted && data.user) {
          setUserData(data.user)
        }
      } catch (err) {
        console.error("Profile error:", err)
        if (isMounted) {
          toast.error(
            err instanceof Error ? err.message : "Could not load user data"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUserData()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!userData) {
    return (
      <div className="alert alert-error">
        <span>Could not load profile data. Please try again later.</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProfileDetails userData={userData} />
      <div className="divider" />
      <Suspense
        fallback={<div className="h-32 animate-pulse rounded-lg bg-base-300" />}
      >
        <ShoppingList />
      </Suspense>
    </div>
  )
}
