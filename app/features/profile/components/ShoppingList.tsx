"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"

import { ExternalLinkIcon } from "@/components/ui/icons"

type PurchasedItem = {
  id: string
  title: string
  description: string | null
  price: number | null
  url: string | null
  wishlistTitle: string
  ownerName: string
  createdAt: string
}

export function ShoppingList() {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadPurchasedItems() {
    try {
      const response = await fetch("/api/purchases")
      if (!response.ok) {
        throw new Error("Could not fetch purchased items")
      }
      const data = await response.json()
      setPurchasedItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])

  const handleCancelPurchase = async (itemId: string) => {
    try {
      const response = await fetch("/api/wishlist/items/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, cancel: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel purchase")
      }

      // Uppdatera listan direkt efter avbokning
      await loadPurchasedItems()
    } catch (error) {
      console.error("Error canceling purchase:", error)
      setError("Failed to cancel purchase")
    }
  }

  if (isLoading) {
    return <div>Loading shopping list...</div>
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  if (purchasedItems.length === 0) {
    return (
      <div className="alert alert-info">
        You haven&apos;t purchased any items yet
      </div>
    )
  }

  const totalAmount = purchasedItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">My purchases</h2>
        <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-base-200 p-4 md:max-w-md">
          <div>
            <span className="text-sm text-base-content/70">
              Total purchases:
            </span>
            <p className="text-xl font-semibold">{purchasedItems.length}</p>
          </div>
          <div>
            <span className="text-sm text-base-content/70">
              Total amount spent:
            </span>
            <p className="text-xl font-semibold text-primary">
              {totalAmount} kr
            </p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-base-300">
        {purchasedItems.map((item) => (
          <div key={item.id} className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="grow space-y-2">
                <h3 className="text-xl font-medium">{item.title}</h3>
                {item.description && (
                  <p className="text-base-content/70">{item.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  {item.price && (
                    <span className="text-lg font-semibold text-primary">
                      {item.price} kr
                    </span>
                  )}
                  <span className="text-sm text-white">
                    From {item.ownerName}&apos;s wishlist: {item.wishlistTitle}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
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
                  <span className="block text-sm opacity-70">
                    Purchased{" "}
                    {format(new Date(item.createdAt), "d MMMM yyyy", {
                      locale: enGB,
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCancelPurchase(item.id)}
                className="btn btn-error btn-xs self-start"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
