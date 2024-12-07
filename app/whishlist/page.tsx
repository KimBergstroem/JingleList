"use client"

import { useEffect, useState } from "react"

import AddItem from "./components/AddItem"
import AddWishlist from "./components/AddWishlist"
import WishlistCard from "./components/Card"
import WishlistItemList from "./components/WishlistItemList"

type Wishlist = {
  id: string
  title: string
  description: string
  occasion: string
  createdAt: Date
  items: WishlistItem[]
}

type WishlistItem = {
  id: string
  title: string
  description: string
  price: number
  url: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  purchased: boolean
  purchasedBy: string | null
}

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null)
  const [showAddWishlist, setShowAddWishlist] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchWishlists()
  }, [])

  const fetchWishlists = async () => {
    try {
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()
        setWishlists(data)
      } else {
        setError("Could not fetch wishlists")
      }
    } catch {
      setError("An error occurred while fetching wishlists")
    }
  }

  const handleWishlistClick = (wishlistId: string) => {
    setSelectedWishlist(wishlistId)
    setShowAddWishlist(false)
  }

  const handleItemAdded = () => {
    fetchWishlists()
  }

  const selectedWishlistData = wishlists.find(
    (wishlist) => wishlist.id === selectedWishlist
  )

  const deleteWishlist = async (wishlistId: string) => {
    try {
      const url = `/api/wishlist?id=${wishlistId}`
      const response = await fetch(url, {
        method: "DELETE",
      })

      if (response.ok) {
        setWishlists((prev) => prev.filter((w) => w.id !== wishlistId))
        if (selectedWishlist === wishlistId) {
          setSelectedWishlist(null)
        }
      } else {
        const data = await response.json()
        setError(data.error || "Could not delete the wishlist")
      }
    } catch {
      setError("An error occurred while deleting the wishlist")
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/wishlist/items?id=${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchWishlists()
      } else {
        const data = await response.json()
        setError(data.error || "Could not delete the item")
      }
    } catch {
      setError("An error occurred while deleting the item")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Main heading and Add new list button */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">My Wishlists</h1>
        <button
          onClick={() => {
            setShowAddWishlist(!showAddWishlist)
            setSelectedWishlist(null)
          }}
          className="btn btn-primary btn-sm sm:btn-md"
        >
          {showAddWishlist ? "Cancel" : "Create new wishlist"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left side - List of wishlists or AddWishlist form */}
        <div>
          {showAddWishlist ? (
            <AddWishlist />
          ) : (
            <div className="space-y-4">
              {wishlists.length === 0 ? (
                <p className="text-gray-500">
                  You have no wishlists yet. Create your first wishlist!
                </p>
              ) : (
                wishlists.map((wishlist) => (
                  <WishlistCard
                    key={wishlist.id}
                    title={wishlist.title}
                    description={wishlist.description}
                    occasion={wishlist.occasion}
                    createdAt={wishlist.createdAt}
                    itemCount={wishlist.items.length}
                    onClick={() => handleWishlistClick(wishlist.id)}
                    onDelete={() => deleteWishlist(wishlist.id)}
                    isSelected={selectedWishlist === wishlist.id}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Right side - Show selected wishlist's items and AddItem form */}
        <div>
          {selectedWishlistData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedWishlistData.title}
                </h2>
                <p className="text-gray-600">{selectedWishlistData.occasion}</p>
              </div>

              {/* List of items */}
              <WishlistItemList
                items={selectedWishlistData.items}
                onDeleteItem={deleteItem}
                isOwner={true}
              />

              {/* AddItem form */}
              <AddItem
                wishlistId={selectedWishlistData.id}
                onItemAdded={handleItemAdded}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
