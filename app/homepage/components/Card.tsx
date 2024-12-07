import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { CheckIcon } from "@/components/ui/icons"

type CardProps = {
  userId: string
  userName: string
  profileImage: string
  occasion: string
  wishlistItems: {
    id: string
    title: string
    description?: string | null
    price: number
    purchased: boolean
    purchasedBy: string | null
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
  wishlistItems,
}: CardProps) {
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(
    new Set(
      wishlistItems.filter((item) => item.purchased).map((item) => item.id)
    )
  )
  const bgColor = occasionColors[occasion] || occasionColors.Other

  useEffect(() => {
    async function fetchPurchasedItems() {
      try {
        const response = await fetch(`/api/wishlist/items/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setPurchasedItems(new Set(data.purchasedItemIds))
        }
      } catch (error) {
        console.error("Error fetching purchased items:", error)
      }
    }

    fetchPurchasedItems()
  }, [userId])

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

      setPurchasedItems((prev) => new Set([...prev, itemId]))
    } catch (error) {
      console.error("Error updating purchase status:", error)
    }
  }

  return (
    <Link
      href={`/users/${userId}`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <div
        className={`card relative ${bgColor} transition-colors duration-200`}
      >
        <div className="absolute -left-2 -top-2 z-10">
          <div className="size-10 overflow-hidden rounded-full ring-2 ring-base-100">
            <Image
              src={profileImage}
              alt={`${userName}&apos;s profile`}
              width={40}
              height={40}
              className="size-full object-cover"
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
                  <CheckIcon className="size-4 shrink-0 text-success sm:size-5" />
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
        </div>
      </div>
    </Link>
  )
}
