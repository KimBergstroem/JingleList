"use client"

import { useState } from "react"

import { SearchIcon } from "./icons"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
    }
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setSearchQuery("")
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    const clickedButton = (e.relatedTarget as HTMLElement)?.closest("button")
    if (!clickedButton) {
      if (!searchQuery.trim()) {
        setIsExpanded(false)
      }
    }
  }

  return (
    <div className="mx-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div
          className={`flex h-10 items-center overflow-hidden transition-all duration-200 ${isExpanded ? "w-64" : "w-0"}`}
        >
          <input
            type="text"
            className="size-full rounded-lg bg-base-200 px-4 outline-none"
            placeholder="Search users and wishlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={handleBlur}
            autoFocus={isExpanded}
          />
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="btn btn-circle btn-ghost shrink-0"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  )
}
