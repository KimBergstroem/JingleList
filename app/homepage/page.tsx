"use client"

import { useEffect, useState } from "react"

import Card from "./components/Card"

type Wishlist = {
  id: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  occasion: string
  items: {
    id: string
    title: string
    description: string
    price: number
  }[]
}

export default function HomePage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])

  useEffect(() => {
    async function fetchWishlists() {
      try {
        const response = await fetch("/api/wishlist/public")
        if (response.ok) {
          const data = await response.json()
          setWishlists(data)
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error)
      }
    }

    fetchWishlists()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {wishlists.map((wishlist) => (
        <Card
          key={wishlist.id}
          userId={wishlist.user.id}
          userName={wishlist.user.name || "Anonymous"}
          profileImage={wishlist.user.image || "/default-avatar.png"}
          occasion={wishlist.occasion}
          wishlistItems={wishlist.items}
        />
      ))}
    </div>
  )
}
