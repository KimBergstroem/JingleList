import Image from "next/image"

import { ProfileIcon } from "@/components/ui/icons"
import type { UserData } from "@/app/features/profile/types"

export function ProfileDetails({ userData }: { userData: UserData }) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="avatar">
          {userData.image ? (
            <div className="w-24 rounded-full">
              <Image
                src={userData.image}
                alt="Profile picture"
                width={96}
                height={96}
                className="rounded-full"
                priority
              />
            </div>
          ) : (
            <div className="w-24 rounded-full bg-neutral text-neutral-content">
              <ProfileIcon />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {userData.name || "No name provided"}
          </h2>
          <p className="text-base-content/70">{userData.email}</p>
        </div>
      </div>

      <div className="divider" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Name</span>
          </label>
          <input
            type="text"
            value={userData.name || ""}
            className="input input-bordered"
            disabled
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            value={userData.email}
            className="input input-bordered"
            disabled
          />
        </div>
      </div>
    </>
  )
}
