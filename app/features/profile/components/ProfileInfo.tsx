"use client"

import { Suspense } from "react"
import { toast } from "react-hot-toast"

import { useUser } from "@/app/features/profile/hooks/useUser"

import { ProfileDetails } from "./ProfileDetails"
import { ProfileSkeleton } from "./ProfileSkeleton"
import { ShoppingList } from "./ShoppingList"

export function ProfileInfo() {
  const { user, isLoading, isError } = useUser()

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError) {
    toast.error("Could not load user data")
    return (
      <div className="alert alert-error">
        <span>Could not load profile data. Please try again later.</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="alert alert-error">
        <span>No user data found.</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProfileDetails userData={user} />
      <div className="divider" />
      <Suspense
        fallback={<div className="h-32 animate-pulse rounded-lg bg-base-300" />}
      >
        <ShoppingList />
      </Suspense>
    </div>
  )
}
