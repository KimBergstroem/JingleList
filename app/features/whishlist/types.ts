export type WishlistItem = {
  id: string
  title: string
  description: string | null
  price: number | null
  url: string | null
  priority: string | null
  purchased: boolean
}

export type Wishlist = {
  id: string
  title: string
  description: string | null
  occasion: string
  createdAt: string
  items: WishlistItem[]
}
