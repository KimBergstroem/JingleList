import Image from "next/image"

import { EyeIcon } from "@/components/ui/icons"

import styles from "../home.module.css"

interface HideProps {
  onFlip: () => void
  isFlipped: boolean
  profileImage?: string
}

export function Hide({ onFlip, isFlipped, profileImage }: HideProps) {
  if (!isFlipped) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onFlip()
        }}
        className="btn btn-ghost btn-sm"
        aria-label="Hide card"
      >
        <EyeIcon className="size-4 text-info sm:size-5" />
      </button>
    )
  }

  return (
    <div className={`${styles.card} relative h-full rounded-full bg-base-200`}>
      <div className="absolute -left-2 -top-2 z-10">
        <div className="size-10 overflow-hidden rounded-full ring-2 ring-base-100">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={40}
              height={40}
              className="size-full object-cover opacity-50"
            />
          ) : (
            <div className="size-full animate-pulse rounded-full bg-base-300" />
          )}
        </div>
      </div>

      <div className={`${styles["card-content"]} card-body`}>
        {/* Skeleton content */}
        <div className="space-y-4">
          <div className="h-6 w-1/2 animate-pulse rounded bg-base-300" />
          <div className="space-y-2">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 rounded-lg bg-base-300 p-4"
              >
                <div className="h-4 w-2/3 animate-pulse rounded bg-base-100/20" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-base-100/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onFlip()
            }}
            className="btn btn-ghost btn-sm"
            aria-label="Show card"
          >
            <EyeIcon className="size-4 text-info sm:size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
