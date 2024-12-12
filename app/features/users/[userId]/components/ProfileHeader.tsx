import Image from "next/image"
import Link from "next/link"

import { ArrowLeftIcon, ProfileIcon } from "@/components/ui/icons"
import type { UserProfile } from "@/app/features/users/[userId]/types"

export function ProfileHeader({ profile }: { profile: UserProfile }) {
  return (
    <>
      <div className="mb-6">
        <Link href="/" className="btn btn-ghost gap-2">
          <ArrowLeftIcon className="size-4" />
          Back to Browse
        </Link>
      </div>
      <div className="mb-12 flex items-center gap-4">
        <div className="size-20 overflow-hidden rounded-full">
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.name || "User"}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral text-neutral-content">
              <ProfileIcon />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold">{profile.name || "Anonymous"}</h1>
      </div>
    </>
  )
}
