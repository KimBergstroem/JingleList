"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

import AddItem from "./components/AddItem"
import AddWishlist from "./components/AddWishlist"
import Card from "./components/Card"
import EditItem from "./components/EditItem"
import WishlistItemList from "./components/WishlistItemList"
import { WishlistSkeleton } from "./components/WishlistSkeleton"
import { type Wishlist, type WishlistItem } from "./types"

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null)
  const [selectedWishlistData, setSelectedWishlistData] =
    useState<Wishlist | null>(null)
  const [showAddWishlist, setShowAddWishlist] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  async function loadWishlists() {
    try {
      const response = await fetch("/api/wishlist", {
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wishlists")
      }

      const data = await response.json()
      setWishlists(data)

      // If there is a selected wishlist, update its data
      if (selectedWishlist) {
        const selected = data.find((w: Wishlist) => w.id === selectedWishlist)
        if (selected) {
          setSelectedWishlistData(selected)
        }
      }
    } catch (error) {
      console.error("Error loading wishlists:", error)
      toast.error("Could not load wishlists")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function loadWishlists() {
      try {
        const response = await fetch("/api/wishlist", {
          credentials: "include",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch wishlists")
        }

        const data = await response.json()
        setWishlists(data)

        // If there is a selected wishlist, update its data
        if (selectedWishlist) {
          const selected = data.find((w: Wishlist) => w.id === selectedWishlist)
          if (selected) {
            setSelectedWishlistData(selected)
          }
        }
      } catch (error) {
        console.error("Error loading wishlists:", error)
        toast.error("Could not load wishlists")
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlists()
  }, [selectedWishlist])

  const handleDelete = async (wishlistId: string) => {
    try {
      const response = await fetch(`/api/wishlist?id=${wishlistId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete wishlist")
      }

      setWishlists((prev) => prev.filter((w) => w.id !== wishlistId))
      if (selectedWishlist === wishlistId) {
        setSelectedWishlist(null)
        setSelectedWishlistData(null)
      }
      toast.success("Wishlist deleted successfully")
    } catch (error) {
      console.error("Error deleting wishlist:", error)
      toast.error("Could not delete wishlist")
    }
  }

  const handleAddWishlist = (newWishlist: Wishlist) => {
    setWishlists((prev) => [newWishlist, ...prev])
    setShowAddWishlist(false)
    toast.success("Wishlist created successfully")
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedWishlistData) return

    try {
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      // Update the local list first for quick feedback
      setSelectedWishlistData({
        ...selectedWishlistData,
        items: selectedWishlistData.items.filter((item) => item.id !== itemId),
      })

      // Load all wishlists to get updated data
      loadWishlists()

      toast.success("Item deleted successfully")
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Could not delete item")
    }
  }

  const handleEditItem = async (itemId: string, updatedData: WishlistItem) => {
    if (!selectedWishlistData) return

    const updatedItems = selectedWishlistData.items.map((item) =>
      item.id === itemId ? { ...item, ...updatedData } : item
    )

    setSelectedWishlistData({
      ...selectedWishlistData,
      items: updatedItems,
    })
  }

  const handleItemAdded = () => {
    // Update wishlist data after a new item has been added
    const updatedWishlist = wishlists.find(
      (w) => w.id === selectedWishlistData?.id
    )
    if (updatedWishlist) {
      setSelectedWishlistData(updatedWishlist)
    }
    // Load all wishlists to get the latest data
    loadWishlists()
  }

  if (isLoading) {
    return <WishlistSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlists</h1>
        <button
          onClick={() => setShowAddWishlist(true)}
          className="btn btn-primary gap-2"
        >
          Add Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left side - List of wishlists */}
        <div>
          {wishlists.length === 0 ? (
            <div className="rounded-lg bg-base-200 p-8 text-center">
              <p className="mb-4 text-lg">
                You haven&apos;t created any wishlists yet.
              </p>
              <button
                onClick={() => setShowAddWishlist(true)}
                className="btn btn-primary"
              >
                Create your first wishlist
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlists.map((wishlist) => (
                <Card
                  key={wishlist.id}
                  wishlist={wishlist}
                  isSelected={selectedWishlist === wishlist.id}
                  onClick={() => {
                    setSelectedWishlist(wishlist.id)
                    setSelectedWishlistData(wishlist)
                  }}
                  onDelete={() => handleDelete(wishlist.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right side - Selected wishlist items */}
        <div>
          {selectedWishlistData && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {selectedWishlistData.title}
                </h2>
                <p className="text-gray-600">{selectedWishlistData.occasion}</p>
              </div>

              {/* AddItem form */}
              <AddItem
                wishlistId={selectedWishlistData.id}
                onItemAdded={handleItemAdded}
              />

              {/* List of items */}
              <WishlistItemList
                items={selectedWishlistData.items}
                onDeleteItem={handleDeleteItem}
                onEditItem={(id) => setEditingItem(id)}
                isOwner={true}
              />
            </div>
          )}
        </div>
      </div>

      <AddWishlist
        isOpen={showAddWishlist}
        onClose={() => setShowAddWishlist(false)}
        onAdd={handleAddWishlist}
      />

      {/* Edit Item Modal */}
      {editingItem && selectedWishlistData && (
        <EditItem
          itemId={editingItem}
          initialData={
            selectedWishlistData.items.find((item) => item.id === editingItem)!
          }
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onEdit={handleEditItem}
        />
      )}
    </div>
  )
}
