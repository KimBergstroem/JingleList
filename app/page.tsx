"use client"

import CountDown from "@/components/ui/CountDown"
import { AddExternalIcon, CheckIcon, EyeIcon } from "@/components/ui/icons"
import HomePage from "@/app/features/homepage/page"

export default function Home() {
  return (
    <div className="container-wrapper">
      {/* Welcome & Stats Section */}
      <div className="mb-12 rounded-lg bg-base-200 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome to Your Gift Hub
            </h1>
            <p className="mt-2 text-base-content/70">
              Discover and manage wishlists for your upcoming celebrations
            </p>
          </div>
          <div className="shrink-0">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                <CountDown />
              </div>
              <div className="mt-1 text-xs text-base-content/70">
                Until Christmas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guide */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="card bg-primary/10">
          <div className="card-body">
            <h3 className="card-title text-primary">Create</h3>
            <p>Start by creating your own wishlist for any occasion</p>
          </div>
        </div>
        <div className="card bg-secondary/10">
          <div className="card-body">
            <h3 className="card-title text-secondary">Share</h3>
            <p>Share your lists with family and friends</p>
          </div>
        </div>
        <div className="card bg-accent/10">
          <div className="card-body">
            <h3 className="card-title text-accent">Track</h3>
            <p>See what&apos;s been purchased without spoiling surprises</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-8 rounded-lg bg-base-200 p-3 sm:p-4">
        <h3 className="mb-2 text-base font-semibold sm:text-lg">
          Status Guide
        </h3>
        <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <div className="mb-2 flex items-center gap-2 rounded bg-base-100 px-2 py-1.5 text-sm sm:px-3 sm:py-2 sm:text-base">
            <button className="btn btn-success btn-xs shrink-0">Buy</button>
            Item available
          </div>
          <span className="text-xs text-base-content/70 sm:text-sm">
            (This button shows when the item is available to buy)
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <div className="mb-2 flex items-center gap-2 rounded bg-base-100 px-2 py-1.5 text-sm sm:px-3 sm:py-2 sm:text-base">
            <CheckIcon className="size-4 text-success sm:size-5" />
            <span>Item purchased</span>
          </div>
          <span className="text-xs text-base-content/70 sm:text-sm">
            (This icon shows when someone has bought the item)
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <div className="mb-2 flex items-center gap-2 rounded bg-base-100 px-2 py-1.5 text-sm sm:px-3 sm:py-2 sm:text-base">
            <EyeIcon className="size-4 text-success sm:size-5" />
            <span>Hide card</span>
          </div>
          <span className="text-xs text-base-content/70 sm:text-sm">
            (This icons allows you to flip the wishlist card so it can be
            currently hidden)
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded bg-base-100 px-2 py-1.5 text-sm sm:px-3 sm:py-2 sm:text-base">
            <AddExternalIcon className="size-4 text-success sm:size-5" />
            <span>Add extra external items</span>
          </div>
          <span className="text-xs text-base-content/70 sm:text-sm">
            (This icon allows you to add external items that have been bought to
            the users whishlist without the user to know)
          </span>
        </div>
      </div>

      {/* Wishlists */}
      <div>
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
          Discover Users Wishlists
        </h2>
        <HomePage />
      </div>
    </div>
  )
}
