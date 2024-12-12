import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { AddExternalIcon, CheckIcon } from "@/components/ui/icons"
import { AddExternalItem } from "@/app/features/homepage/components/AddExternalItem"

import { Hide } from "./Hide"

type CardProps = {
  userId: string
  userName: string
  profileImage: string
  occasion: string
  wishlist: {
    id: string
  }
  wishlistItems: {
    id: string
    title: string
    description?: string | null
    price: number
    purchased: boolean
    purchasedBy: string | null
    purchasedByUser?: {
      name: string | null
      image: string | null
    } | null
  }[]
}

const occasionColors: Record<string, string> = {
  Christmas: "bg-red-500/10 hover:bg-red-500/20",
  Birthday: "bg-purple-500/10 hover:bg-purple-500/20",
  "Father's Day": "bg-blue-500/10 hover:bg-blue-500/20",
  "Mother's Day": "bg-pink-500/10 hover:bg-pink-500/20",
  "Valentine's Day": "bg-rose-500/10 hover:bg-rose-500/20",
  Other: "bg-gray-500/10 hover:bg-gray-500/20",
}

export default function Card({
  userId,
  userName,
  profileImage,
  occasion,
  wishlist,
  wishlistItems: initialWishlistItems,
}: CardProps) {
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(
    new Set(
      initialWishlistItems
        .filter((item) => item.purchased)
        .map((item) => item.id)
    )
  )
  const [isFlipped, setIsFlipped] = useState(false)
  const [showExternalModal, setShowExternalModal] = useState(false)
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)
  const bgColor = occasionColors[occasion] || occasionColors.Other

  const handlePurchase = async (itemId: string) => {
    try {
      const response = await fetch("/api/wishlist/items/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update purchase status")
      }

      // Uppdatera UI:n direkt
      setPurchasedItems((prev) => new Set([...prev, itemId]))

      // Uppdatera wishlistItems med den nya datan från API:t
      const data = await response.json()
      setWishlistItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                purchased: true,
                purchasedByUser: data.purchasedByUser,
              }
            : item
        )
      )
    } catch (error) {
      console.error("Error updating purchase status:", error)
    }
  }

  return (
    <>
      <div className="block transition-transform hover:scale-[1.02]">
        {!isFlipped ? (
          <Link href={`/features/users/${userId}`}>
            <div
              className={`card relative ${bgColor} transition-all duration-300`}
            >
              <div className="card-content">
                <div className="absolute -left-2 -top-2 z-10">
                  <div className="size-10 overflow-hidden rounded-full ring-2 ring-base-100">
                    <Image
                      src={profileImage}
                      alt={`${userName}'s profile`}
                      width={40}
                      height={40}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="card-body pt-8">
                  <div className="mb-4 text-center text-sm font-medium opacity-75">
                    {occasion} List
                  </div>

                  <ul className="space-y-2">
                    {wishlistItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg bg-base-100/50 p-2 text-xs sm:text-sm"
                      >
                        <span className="flex-1 truncate font-medium">
                          {item.title}
                        </span>
                        <span className="whitespace-nowrap text-primary">
                          {item.price} kr
                        </span>
                        {purchasedItems.has(item.id) ? (
                          <div className="dropdown dropdown-end dropdown-hover">
                            <div tabIndex={0} role="button">
                              <CheckIcon className="size-4 shrink-0 text-success sm:size-5" />
                            </div>
                            {item.purchasedByUser && (
                              <div className="card dropdown-content card-compact z-[1] w-48 bg-base-200 shadow">
                                <div className="card-body items-center">
                                  <div className="avatar">
                                    <div className="size-12 rounded-full ring ring-success">
                                      {item.purchasedByUser.image ? (
                                        <Image
                                          src={item.purchasedByUser.image}
                                          alt={
                                            item.purchasedByUser.name ||
                                            "Purchaser"
                                          }
                                          width={48}
                                          height={48}
                                          className="size-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex size-full items-center justify-center bg-base-300">
                                          <span className="text-lg font-bold">
                                            {(
                                              item.purchasedByUser.name?.[0] ||
                                              "?"
                                            ).toUpperCase()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-center text-sm">
                                    Purchased by{" "}
                                    <span className="font-semibold">
                                      {item.purchasedByUser.name || "Anonymous"}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              handlePurchase(item.id)
                            }}
                            className="btn btn-success btn-xs shrink-0"
                          >
                            Buy
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setShowExternalModal(true)
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      <AddExternalIcon className="size-4 text-info sm:size-5" />
                    </button>
                    <Hide
                      onFlip={() => setIsFlipped(!isFlipped)}
                      isFlipped={isFlipped}
                      profileImage={profileImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="card relative bg-base-300/50 backdrop-blur-sm">
            <Hide
              onFlip={() => setIsFlipped(!isFlipped)}
              isFlipped={isFlipped}
              profileImage={profileImage}
            />
          </div>
        )}
      </div>
      {showExternalModal && (
        <AddExternalItem
          isOpen={showExternalModal}
          onClose={() => setShowExternalModal(false)}
          wishlistId={wishlist.id}
          onItemAdded={() => {
            fetch(`/api/wishlist/public`)
              .then((res) => res.json())
              .then((data) => {
                const userWishlist = data.find(
                  (w: { user: { id: string } }) => w.user.id === userId
                )
                if (userWishlist) {
                  setWishlistItems(userWishlist.items)
                }
              })
          }}
        />
      )}
    </>
  )
}
