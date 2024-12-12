"use client"

import { use, useEffect, useState } from "react"

import { ErrorIcon, WarningIcon } from "@/components/ui/icons"

import { ProfileHeader } from "./components/ProfileHeader"
import { WishlistCard } from "./components/WishlistCard"
import type { UserProfile } from "./types"

type SessionType = {
  user?: {
    id: string
    name: string | null
    email: string
  } | null
}

export default function PublicUserProfile({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = use(params)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedWishlist, setExpandedWishlist] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [session, setSession] = useState<SessionType | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        const [profileResponse, sessionResponse] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch("/api/users/me"),
        ])

        const profileData = await profileResponse.json()
        const sessionData = await sessionResponse.json()

        if (!profileResponse.ok) {
          throw new Error(profileData.error || "Could not load profile")
        }

        setProfile(profileData)
        setIsOwner(sessionData.user?.id === userId)
        setSession(sessionData)
      } catch (err) {
        console.error("Profile error:", err)
        setError(
          err instanceof Error ? err.message : "Could not load user profile"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  const handlePurchase = async () => {
    try {
      // Uppdatera profilen för att reflektera ändringen
      const profileResponse = await fetch(`/api/users/${userId}`, {
        cache: "no-store",
        next: { revalidate: 0 },
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        throw new Error(errorData.error || "Failed to fetch updated profile")
      }

      const updatedProfile = await profileResponse.json()
      setProfile(updatedProfile)
      return true
    } catch (error) {
      console.error(
        "Error updating profile:",
        error instanceof Error ? error.message : error
      )
      return false
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="alert alert-error mx-auto max-w-md">
        <ErrorIcon />
        <span>{error}</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="alert alert-warning mx-auto max-w-md">
        <WarningIcon />
        <span>No profile found</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />

      {/* Wishlists */}
      <div className="space-y-8">
        {profile.wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            isExpanded={expandedWishlist === wishlist.id}
            onToggle={() =>
              setExpandedWishlist(
                expandedWishlist === wishlist.id ? null : wishlist.id
              )
            }
            isOwner={isOwner}
            session={session}
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  )
}
