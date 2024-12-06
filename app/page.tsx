"use client"

import CountDown from "@/components/ui/CountDown"
import { CheckIcon } from "@/components/ui/icons"
import HomePage from "@/app/homepage/page"

export default function Home() {
  return (
    <div className="container-wrapper">
      <div>
        <h1 className="mb-4 text-center text-4xl font-bold">
          Welcome to JingleList
        </h1>
        <p className="text-lg">
          This is a simple app to share and update wish lists with family and
          friends, keeping surprises intact. This is only good for shopping
          lists. Cross the item from someone else&apos;s list, when you have
          bought it, so other people know not to buy.
        </p>
      </div>

      <div className="mt-24 flex flex-col items-center">
        <h2 className="text-2xl font-semibold">Countdown to Christmas 2024!</h2>
        <CountDown />
      </div>

      <div className="mb-4 mt-10">
        <div className="mb-8 rounded-lg bg-base-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Status</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded bg-base-100 px-3 py-2">
              <CheckIcon className="size-5 text-success" />
              <span>= Item has been purchased</span>
            </div>
            <span className="text-sm text-base-content/70">
              (When you see this icon, someone has bought the item)
            </span>
          </div>
        </div>

        <h2 className="mb-10 text-2xl font-semibold">
          Different wish lists from users
        </h2>
        <HomePage />
      </div>

      <div className="mt-8 grid gap-6"></div>
    </div>
  )
}
