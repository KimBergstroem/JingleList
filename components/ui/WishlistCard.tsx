"use client"

export type WishlistItem = {
  id: string
  title: string
  description: string
  price?: number
  url?: string
  priority?: "low" | "medium" | "high"
}

type WishlistCardProps = {
  item: WishlistItem
  onEdit?: (item: WishlistItem) => void
  onDelete?: (id: string) => void
}

export default function WishlistCard({
  item,
  onEdit,
  onDelete,
}: WishlistCardProps) {
  const { title, description, price, url, priority } = item

  const priorityColors = {
    low: "badge-success",
    medium: "badge-warning",
    high: "badge-error",
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">{title}</h2>
          {priority && (
            <div className={`badge ${priorityColors[priority]}`}>
              {priority}
            </div>
          )}
        </div>

        <p>{description}</p>

        {price && (
          <p className="text-lg font-semibold text-primary">
            {price.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
            })}
          </p>
        )}

        <div className="card-actions justify-end">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Visa produkt
            </a>
          )}
          {onEdit && (
            <button onClick={() => onEdit(item)} className="btn btn-ghost">
              Redigera
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="btn btn-ghost text-error"
            >
              Ta bort
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
