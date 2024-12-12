import { useState } from "react"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"

import { CheckIcon, ExternalLinkIcon } from "@/components/ui/icons"
import type {
  Wishlist,
  WishlistItem,
} from "@/app/features/users/[userId]/types"

type WishlistCardProps = {
  wishlist: Wishlist
  isExpanded: boolean
  onToggle: () => void
  isOwner: boolean
  session: SessionType | null
  onPurchase: (itemId: string, isCancel: boolean) => void
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

export function WishlistCard({
  wishlist,
  isExpanded,
  onToggle,
  isOwner,
  session,
  onPurchase,
}: WishlistCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-base-200 shadow-lg">
      {/* Wishlist Header */}
      <div
        className="cursor-pointer bg-base-300 p-6 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle()
          }
        }}
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
      {isExpanded && (
        <div className="divide-y divide-base-300">
          {wishlist.items.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              isOwner={isOwner}
              session={session}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistItem({
  item,
  isOwner,
  session,
  onPurchase,
}: {
  item: WishlistItem
  isOwner: boolean
  session: SessionType | null
  onPurchase: (itemId: string, isCancel: boolean) => void
}) {
  const [isPurchased, setIsPurchased] = useState(item.purchased)
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchaseClick = async (isCancel: boolean) => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/wishlist/items/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: item.id, cancel: isCancel }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update purchase status")
      }

      setIsPurchased(data.purchased)
      onPurchase(item.id, isCancel)
    } catch (error) {
      console.error("Error handling purchase:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
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
                  priorityColors[item.priority as keyof typeof priorityColors]
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
            {isPurchased ? (
              <div
                className={`btn btn-success btn-sm flex items-center gap-2 ${
                  item.purchasedBy === session?.user?.id
                    ? "hover:btn-error"
                    : "cursor-not-allowed opacity-80"
                }`}
                onClick={() => {
                  if (item.purchasedBy === session?.user?.id) {
                    handlePurchaseClick(true)
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
                onClick={() => handlePurchaseClick(false)}
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
}
