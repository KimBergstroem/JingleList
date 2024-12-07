"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"

import {
  ArrowLeftIcon,
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
      <div className="mb-6">
        <Link href="/" className="btn btn-ghost gap-2">
          <ArrowLeftIcon className="size-4" />
          Tillbaka till Browse
        </Link>
      </div>
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-xl font-semibold sm:text-2xl">
                    {wishlist.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="badge badge-primary text-xs sm:text-sm">
                      {wishlist.occasion}
                    </span>
                    <span className="text-xs opacity-70 sm:text-sm">
                      Created{" "}
                      {format(new Date(wishlist.createdAt), "d MMM yyyy", {
                        locale: enGB,
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-medium sm:text-lg">
                    {wishlist.items.length}{" "}
                    {wishlist.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              {wishlist.description && (
                <p className="mt-4 break-words text-sm text-base-content/70 sm:text-base">
                  {wishlist.description}
                </p>
              )}
            </div>

            {/* Wishlist Items */}
            {expandedWishlist === wishlist.id && (
              <div className="divide-y divide-base-300">
                {wishlist.items.map((item) => {
                  return (
                    <div key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1 space-y-2">
                          <h3 className="break-words text-base font-medium sm:text-xl">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="break-words text-sm text-base-content/70 sm:text-base">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            {item.price && (
                              <span className="text-base font-semibold text-primary sm:text-lg">
                                {item.price} kr
                              </span>
                            )}
                            {item.priority && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm ${
                                  priorityColors[
                                    item.priority as keyof typeof priorityColors
                                  ]
                                }`}
                              >
                                {item.priority}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 whitespace-nowrap text-accent hover:underline"
                              >
                                <span>Visit product link</span>
                                <ExternalLinkIcon />
                              </a>
                            )}
                            <span className="whitespace-nowrap opacity-70">
                              Added{" "}
                              {format(new Date(item.createdAt), "d MMM yyyy", {
                                locale: enGB,
                              })}
                            </span>
                          </div>
                        </div>
                        {!isOwner && (
                          <div className="flex shrink-0 justify-end">
                            {item.purchased ? (
                              <div
                                className={`btn btn-success btn-sm flex items-center gap-2 ${
                                  item.purchasedBy === session?.user?.id
                                    ? "hover:btn-error"
                                    : "cursor-not-allowed opacity-80"
                                }`}
                                onClick={() => {
                                  if (item.purchasedBy === session?.user?.id) {
                                    handlePurchase(item.id, true)
                                  }
                                }}
                              >
                                <CheckIcon className="size-4 text-black sm:size-5" />
                                <span className="text-xs text-black sm:text-sm">
                                  {item.purchasedBy === session?.user?.id
                                    ? "Cancel Purchase"
                                    : "Purchased"}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handlePurchase(item.id, false)}
                                className="btn btn-success btn-sm shrink-0"
                              >
                                Buy
                              </button>
                            )}
                          </div>
                        )}
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
