"use client"

import { format } from "date-fns"
import { enGB } from "date-fns/locale"

import TrashIcon from "@/components/ui/icons/TrashIcon"

type Wishlist = {
  id: string
  title: string
  description: string | null
  occasion: string
  createdAt: string
  items: {
    id: string
    title: string
    description: string | null
    price: number | null
    url: string | null
    priority: string | null
  }[]
}

type WishlistCardProps = {
  wishlist: Wishlist
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
}

export default function Card({
  wishlist,
  isSelected,
  onClick,
  onDelete,
}: WishlistCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer space-y-2 rounded-lg border p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-gray-800 hover:border-indigo-500"
      }`}
    >
      {/* Occasion and Items count */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Occasion
          </p>
          <div className="mt-1 rounded-md bg-base-300 px-2 py-1">
            <span className="text-sm font-semibold">{wishlist.occasion}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Items
          </p>
          <p className="text-sm font-medium text-gray-300">
            {wishlist.items.length}{" "}
            {wishlist.items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Title and Description */}
      <div className="min-h-10">
        <h3 className="break-words text-lg font-bold text-white">
          {wishlist.title}
        </h3>
        {wishlist.description && (
          <p className="mt-1 line-clamp-1 break-words text-sm text-gray-300">
            {wishlist.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Created{" "}
          {format(new Date(wishlist.createdAt), "d MMM yyyy", {
            locale: enGB,
          })}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="btn btn-ghost btn-sm text-error"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
