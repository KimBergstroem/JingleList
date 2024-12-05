"use client"

import { format } from "date-fns"
import { enGB } from "date-fns/locale"

import TrashIcon from "@/components/ui/icons/TrashIcon"

const occasionColors: Record<string, { bg: string; text: string }> = {
  Christmas: { bg: "bg-red-500/20", text: "text-red-300" },
  Birthday: { bg: "bg-purple-500/20", text: "text-purple-300" },
  FathersDay: { bg: "bg-blue-500/20", text: "text-blue-300" },
  MothersDay: { bg: "bg-pink-500/20", text: "text-pink-300" },
  ValentinesDay: { bg: "bg-rose-500/20", text: "text-rose-300" },
  Other: { bg: "bg-gray-500/20", text: "text-gray-300" },
}

type WishlistCardProps = {
  title: string
  description: string
  occasion: string
  createdAt: Date
  itemCount: number
  onClick: () => void
  onDelete: () => void
  isSelected: boolean
}

export type WishlistItem = {
  id: string
  title: string
  description: string
  price?: number
  url?: string
  priority?: "HIGH" | "MEDIUM" | "LOW"
}

export default function WishlistCard({
  title,
  description,
  occasion,
  createdAt,
  itemCount,
  onClick,
  onDelete,
  isSelected,
}: WishlistCardProps) {
  const colors = occasionColors[occasion] || occasionColors.Other

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer space-y-3 rounded-lg border p-4 transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-gray-800 hover:border-indigo-500"
      }`}
    >
      {/* Occasion  */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Occasion
          </p>
          <div className={`rounded-md ${colors.bg} px-3 py-2`}>
            <span className={`text-base font-semibold ${colors.text}`}>
              {occasion}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Number of items
          </p>
          <p className="text-sm font-medium text-gray-300">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {/* Description */}
      {description && <p className="text-sm text-gray-300">{description}</p>}

      {/* Created date */}
      <div className="text-xs text-gray-500">
        Created{" "}
        {format(new Date(createdAt), "d MMMM yyyy 'at.' HH:mm", {
          locale: enGB,
        })}
      </div>

      {/* Delete button */}
      <div className="card-actions justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="btn btn-ghost text-error"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
