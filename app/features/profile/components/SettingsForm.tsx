"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { useUser } from "@/app/features/profile/hooks/useUser"

export function SettingsForm() {
  const router = useRouter()
  const { user, mutate } = useUser()
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.image || null
  )

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const imageFile = formData.get("image") as File

    if (imageFile?.size > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(imageFile)
      reader.onload = async () => {
        formData.set("image", reader.result as string)
        await submitForm(formData)
      }
    } else {
      await submitForm(formData)
    }
  }

  async function submitForm(formData: FormData) {
    try {
      const formDataObj = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        image: imagePreview,
      }

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      await mutate()
      toast.success("Profile updated successfully!")
      router.refresh()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      )
    }
  }

  if (!user) {
    toast.error("No user data found")
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Picture</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <Image
                src={imagePreview || "/default-avatar.png"}
                alt="Profile picture preview"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user.name || ""}
              className="input input-bordered"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className="input input-bordered"
              required
            />
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Notification Settings</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Email Notifications</span>
              <input
                type="checkbox"
                name="emailNotifications"
                className="toggle"
                defaultChecked
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">List Updates</span>
              <input
                type="checkbox"
                name="listUpdates"
                className="toggle"
                defaultChecked
              />
            </label>
          </div>
        </div>
      </section>

      {/* Privacy Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Privacy Settings</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Public Profile</span>
              <input type="checkbox" name="publicProfile" className="toggle" />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Show Email</span>
              <input type="checkbox" name="showEmail" className="toggle" />
            </label>
          </div>
        </div>
      </section>

      <button type="submit" className="btn btn-primary">
        Save Changes
      </button>
    </form>
  )
}
