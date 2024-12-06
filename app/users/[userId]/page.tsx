"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"

import { ProfileIcon } from "@/components/ui/icons"

type UserProfile = {
  name: string | null
  image: string | null
  wishlists: {
    id: string
    title: string
    occasion: string
    items: {
      id: string
      title: string
      description: string
      price: number
    }[]
  }[]
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

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Kunde inte ladda profilen")
        }

        setProfile(data)
      } catch (err) {
        console.error("Profilfel:", err)
        setError(
          err instanceof Error
            ? err.message
            : "Kunde inte ladda användarprofilen"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error mx-auto max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="alert alert-warning mx-auto max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Ingen profil hittades</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="size-20 overflow-hidden rounded-full">
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.name || "User"}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral text-neutral-content">
              <ProfileIcon />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold">{profile.name || "Anonymous"}</h1>
      </div>

      {/* Wishlists */}
      <div className="space-y-6">
        {profile.wishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            className="rounded-lg bg-base-200 p-6 shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              {wishlist.occasion} List
            </h2>
            <ul className="space-y-3">
              {wishlist.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-base-100 p-3"
                >
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-base-content/70">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="ml-4 font-medium text-primary">
                    {item.price} kr
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
