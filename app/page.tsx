"use client"

import WishlistCard, { WishlistItem } from "@/components/ui/WishlistCard"

export default function Home() {
  const wishlistItems = [
    {
      id: "1",
      title: "PlayStation 5",
      description: "Senaste spelkonsolen från Sony",
      price: 6499,
      url: "https://example.com/ps5",
      priority: "high" as const,
    },
  ]

  const handleEdit = (item: WishlistItem) => {
    // eslint-disable-next-line no-console
    console.log("Edit item:", item)
  }

  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-console
    console.log("Delete item:", id)
  }

  return (
    <div className="container-wrapper">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Välkommen till JingleList</h1>
        <p className="text-lg">
          This is a simple app to share and update wish lists with family and
          friends, keeping surprises intact. This is only good for shopping
          lists. Cross the item from someone elses list, when you have bought
          it, so other people know not to buy.
        </p>
      </div>

      <div className="mb-4 mt-10">
        <h2 className="text-2xl font-semibold">Senast tillagda önskelistor!</h2>
        <p className="text-gray-600">
          För att se alla önskelistor, vänligen logga in.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        {wishlistItems.map((item) => (
          <WishlistCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
