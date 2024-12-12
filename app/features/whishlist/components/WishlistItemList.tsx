import { useState } from "react"

import { CheckIcon, PencilIcon, TrashIcon } from "@/components/ui/icons"

import { type WishlistItem } from "../types"

type WishlistItemListProps = {
  items: WishlistItem[]
  onDeleteItem?: (id: string) => void
  onEditItem?: (id: string, item: Partial<WishlistItem>) => void
  isOwner?: boolean
}

export default function WishlistItemList({
  items,
  onDeleteItem,
  onEditItem,
  isOwner = false,
}: WishlistItemListProps) {
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(
    new Set(items.filter((item) => item.purchased).map((item) => item.id))
  )

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
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-gray-500">No items in this wishlist yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Price: {item.price} kr
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-400">
                    {item.description}
                  </p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-accent hover:underline"
                  >
                    Visit product link
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isOwner &&
                  (purchasedItems.has(item.id) ? (
                    <div className="flex items-center gap-2">
                      <CheckIcon className="size-5 text-success" />
                      <span className="text-sm text-success">Purchased</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item.id)}
                      className="btn btn-success btn-sm"
                    >
                      Mark as Purchased
                    </button>
                  ))}
                {isOwner && (
                  <div className="flex items-center gap-2">
                    {onEditItem && (
                      <button
                        onClick={() => onEditItem(item.id, item)}
                        className="btn btn-ghost btn-sm text-accent hover:bg-accent/10"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                    )}
                    {onDeleteItem && (
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
