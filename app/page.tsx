"use client"

import CountDown from "@/components/ui/CountDown"
import WishlistCard, { WishlistItem } from "@/components/ui/WishlistCard"

export default function Home() {
  const wishlistItems = [
    {
      id: "1",
      title: "PlayStation 5",
      description: "The latest game console from Sony",
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
        <h1 className="mb-4 text-4xl font-bold">Welcome to JingleList</h1>
        <p className="text-lg">
          This is a simple app to share and update wish lists with family and
          friends, keeping surprises intact. This is only good for shopping
          lists. Cross the item from someone else&apos;s list, when you have
          bought it, so other people know not to buy.
        </p>
      </div>

      <div className="mb-4 mt-10">
        <h2 className="text-2xl font-semibold">
          Latest whish items that user have whised for!
        </h2>
        <p className="text-gray-600">To see all wish lists, please log in.</p>
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
      <div className="mt-24 flex flex-col items-center">
        <h2 className="text-2xl font-semibold">Countdown to Christmas 2024!</h2>
        <CountDown />
      </div>
    </div>
  )
}
