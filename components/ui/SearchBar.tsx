"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { SearchIcon } from "./icons"

type SearchResult = {
  users: {
    id: string
    name: string | null
    image: string | null
  }[]
  wishlists: {
    id: string
    title: string
    occasion: string
    user: {
      id: string
      name: string | null
    }
  }[]
}

export default function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      setIsLoading(true)
      fetch(`/api/searchbar?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data)
        })
        .catch((error) => {
          console.error("Search error:", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setResults(null)
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    const clickedButton = (e.relatedTarget as HTMLElement)?.closest("button")
    if (!clickedButton) {
      setTimeout(() => {
        setResults(null)
        if (!searchQuery.trim()) {
          setIsExpanded(false)
        }
      }, 200)
    }
  }

  const navigateToProfile = (userId: string) => {
    router.push(`/users/${userId}`)
    setIsExpanded(false)
    setSearchQuery("")
    setResults(null)
  }

  return (
    <div className="relative mx-4">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className={`flex h-10 items-center overflow-hidden transition-all duration-200 ${
            isExpanded ? "w-64" : "w-0"
          }`}
        >
          <input
            type="text"
            className="size-full rounded-lg bg-base-200 px-4 outline-none"
            placeholder="Search users and wishlists..."
            value={searchQuery}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoFocus={isExpanded}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setIsExpanded(!isExpanded)
            if (!isExpanded) {
              setSearchQuery("")
              setResults(null)
            }
          }}
          className="btn btn-circle btn-ghost shrink-0"
        >
          <SearchIcon />
        </button>
      </form>

      {/* Search result dropdown */}
      {isExpanded && results && searchQuery.trim().length > 0 && (
        <div className="absolute left-0 right-12 top-12 z-50 max-h-96 overflow-auto rounded-lg bg-base-100 p-2 shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center">Searching...</div>
          ) : (
            <>
              {results.users.length === 0 && results.wishlists.length === 0 ? (
                <div className="p-4 text-center text-base-content/70">
                  No results found
                </div>
              ) : (
                <>
                  {/* User results */}
                  {results.users.length > 0 && (
                    <div className="mb-4">
                      <h3 className="mb-2 px-2 text-sm font-semibold text-base-content/70">
                        Users
                      </h3>
                      {results.users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => navigateToProfile(user.id)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-base-200"
                        >
                          <div className="avatar">
                            <div className="size-8 rounded-full">
                              {user.image ? (
                                <Image
                                  src={user.image}
                                  alt={user.name || ""}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="size-full rounded-full bg-primary text-primary-content" />
                              )}
                            </div>
                          </div>
                          <span>{user.name || "Anonymous user"}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Wishlist results */}
                  {results.wishlists.length > 0 && (
                    <div>
                      <h3 className="mb-2 px-2 text-sm font-semibold text-base-content/70">
                        Wishlists
                      </h3>
                      {results.wishlists.map((wishlist) => (
                        <button
                          key={wishlist.id}
                          onClick={() => navigateToProfile(wishlist.user.id)}
                          className="flex w-full flex-col gap-1 rounded-lg p-2 text-left hover:bg-base-200"
                        >
                          <span className="font-medium">{wishlist.title}</span>
                          <span className="text-sm text-base-content/70">
                            by {wishlist.user.name || "Anonymous user"} •{" "}
                            {wishlist.occasion}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
