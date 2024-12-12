export type WishlistItem = {
  id: string
  title: string
  description: string | null
  price: number | null
  url: string | null
  priority: string | null
  purchased: boolean
  purchasedBy: string | null
  createdAt: string
  updatedAt: string
}

export type Wishlist = {
  id: string
  title: string
  description: string | null
  occasion: string
  createdAt: string
  updatedAt: string
  items: WishlistItem[]
}

export type UserProfile = {
  name: string | null
  image: string | null
  wishlists: Wishlist[]
}
