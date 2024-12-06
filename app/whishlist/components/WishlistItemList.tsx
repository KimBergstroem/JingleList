import TrashIcon from "@/components/ui/icons/TrashIcon"

type WishlistItem = {
  id: string
  title: string
  description: string
  price: number
  url: string
  priority: "HIGH" | "MEDIUM" | "LOW"
}

type WishlistItemListProps = {
  items: WishlistItem[]
  onDeleteItem?: (itemId: string) => void
}

export default function WishlistItemList({
  items,
  onDeleteItem,
}: WishlistItemListProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-gray-500">No items in this wishlist yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                {item.description && (
                  <p className="mt-1 text-gray-600">{item.description}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Price: {item.price} kr
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    item.priority === "HIGH"
                      ? "bg-red-100 text-red-800"
                      : item.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.priority}
                </span>
                {onDeleteItem && (
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                )}
              </div>
            </div>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-accent hover:text-accent/80"
              >
                Visit link →
              </a>
            )}
          </div>
        ))
      )}
    </div>
  )
}
