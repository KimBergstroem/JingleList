"use client"

import { lazy, Suspense } from "react"
import useSWR from "swr"

import SkeletonCard from "./components/SkeletonCard"

const Card = lazy(() => import("./components/Card"))

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
    price: number
    purchased: boolean
    purchasedBy: string | null
    description: string | null
  }[]
  _count: {
    items: number
  }
}

const fetcher = async (url: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || `HTTP error! status: ${res.status}`)
    }

    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      console.error("JSON Parse Error:", e)
      console.error("Raw response:", text.substring(0, 200))
      throw new Error("Ogiltig JSON-respons från servern")
    }
  } catch (error) {
    if (
      error instanceof Error &&
      "name" in error &&
      error.name === "AbortError"
    ) {
      throw new Error("Förfrågan tog för lång tid")
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export default function HomePage() {
  const { data: wishlists, error } = useSWR("/api/wishlist/public", fetcher)

  if (error) {
    return (
      <div className="alert alert-error">
        Error loading wishlists: {error.message}
      </div>
    )
  }

  if (!wishlists) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {wishlists.map((wishlist: Wishlist) => (
        <Suspense key={wishlist.id} fallback={<SkeletonCard />}>
          <Card
            userId={wishlist.user.id}
            userName={wishlist.user.name || "Anonymous"}
            profileImage={wishlist.user.image || "/default-avatar.png"}
            occasion={wishlist.occasion}
            wishlist={wishlist}
            wishlistItems={wishlist.items}
          />
        </Suspense>
      ))}
    </div>
  )
}
