"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"

import {
  CheckIcon,
  ErrorIcon,
  ExternalLinkIcon,
  ProfileIcon,
  WarningIcon,
} from "@/components/ui/icons"

type WishlistItem = {
  id: string
  title: string
  description: string | null
  price: number | null
  url: string | null
  priority: string | null
  purchased: boolean
  purchasedBy: string | null
  createdAt: string
  updatedAt: string
}

type Wishlist = {
  id: string
  title: string
  description: string | null
  occasion: string
  createdAt: string
  updatedAt: string
  items: WishlistItem[]
}

type UserProfile = {
  name: string | null
  image: string | null
  wishlists: Wishlist[]
}

type SessionType = {
  user?: {
    id: string
    name: string | null
    email: string
  } | null
}

const priorityColors = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
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
          fetch("/api/user"),
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

  const handlePurchase = async (itemId: string, cancel: boolean) => {
    try {
      const response = await fetch("/api/wishlist/items/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, cancel }),
      })

      if (!response.ok) {
        throw new Error("Failed to update purchase status")
      }

      // Uppdatera UI:n
      setProfile((prevData) => {
        if (!prevData) return null
        return {
          ...prevData,
          wishlists: prevData.wishlists.map((list) => ({
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    purchased: !cancel,
                    purchasedBy: cancel ? null : (session?.user?.id ?? null),
                  }
                : item
            ),
          })),
        }
      })
    } catch (error) {
      console.error("Error updating purchase status:", error)
    }
  }

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
      {/* Profile Header */}
      <div className="mb-12 flex items-center gap-4">
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
      <div className="space-y-8">
        {profile.wishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            className="overflow-hidden rounded-lg bg-base-200 shadow-lg"
          >
            {/* Wishlist Header */}
            <div
              className="cursor-pointer bg-base-300 p-6"
              onClick={() =>
                setExpandedWishlist(
                  expandedWishlist === wishlist.id ? null : wishlist.id
                )
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{wishlist.title}</h2>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="badge badge-primary">
                      {wishlist.occasion}
                    </span>
                    <span className="text-sm opacity-70">
                      Created{" "}
                      {format(new Date(wishlist.createdAt), "d MMMM yyyy", {
                        locale: enGB,
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-medium">
                    {wishlist.items.length}{" "}
                    {wishlist.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              {wishlist.description && (
                <p className="mt-4 text-base-content/70">
                  {wishlist.description}
                </p>
              )}
            </div>

            {/* Wishlist Items */}
            {expandedWishlist === wishlist.id && (
              <div className="divide-y divide-base-300">
                {wishlist.items.map((item) => {
                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-medium">{item.title}</h3>
                          {item.description && (
                            <p className="text-base-content/70">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4">
                            {item.price && (
                              <span className="text-lg font-semibold text-primary">
                                {item.price} kr
                              </span>
                            )}
                            {item.priority && (
                              <span
                                className={`rounded-full px-3 py-1 text-sm ${
                                  priorityColors[
                                    item.priority as keyof typeof priorityColors
                                  ]
                                }`}
                              >
                                {item.priority}
                              </span>
                            )}
                            {!isOwner &&
                              (item.purchased ? (
                                <div
                                  className={`btn btn-success btn-sm flex items-center gap-2 ${
                                    item.purchasedBy === session?.user?.id
                                      ? "hover:btn-error"
                                      : "cursor-not-allowed opacity-80"
                                  }`}
                                  onClick={() => {
                                    if (
                                      item.purchasedBy === session?.user?.id
                                    ) {
                                      handlePurchase(item.id, true)
                                    }
                                  }}
                                >
                                  <CheckIcon className="size-5 text-black" />
                                  <span className="text-sm text-black">
                                    {item.purchasedBy === session?.user?.id
                                      ? "Cancel Purchase"
                                      : "Purchased"}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handlePurchase(item.id, false)}
                                  className="btn btn-success btn-sm"
                                >
                                  Buy
                                </button>
                              ))}
                          </div>
                          <div className="mt-4 flex items-center gap-4">
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-accent hover:underline"
                              >
                                Visit product link
                                <ExternalLinkIcon />
                              </a>
                            )}
                            <span className="text-sm opacity-70">
                              Added{" "}
                              {format(new Date(item.createdAt), "d MMMM yyyy", {
                                locale: enGB,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
