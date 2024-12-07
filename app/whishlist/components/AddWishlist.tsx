"use client"

import { useState } from "react"

import {
  validateWishlistForm,
  type WishlistFormData,
} from "@/lib/utils/form-validation"

const occasionTypes = [
  "Christmas",
  "Birthday",
  "Father's Day",
  "Mother's Day",
  "Valentine's Day",
  "Other",
] as const

const initialFormData: WishlistFormData = {
  title: "",
  description: "",
  occasion: occasionTypes[0],
}

type FormErrors = {
  [key: string]: string
}

export default function AddWishlist() {
  const [formData, setFormData] = useState<WishlistFormData>(initialFormData)
  const [error, setError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    setSuccess(false)
    setIsSubmitting(true)

    // Validate the form
    const validationResult = validateWishlistForm(formData)
    if (!validationResult.success) {
      const errors = validationResult.errors.reduce(
        (acc, error) => ({
          ...acc,
          [error.field]: error.message,
        }),
        {} as FormErrors
      )
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData(initialFormData)
        // Wait a bit so the user can see the success message
        await new Promise((resolve) => setTimeout(resolve, 1500))
        window.location.href = "/whishlist"
      } else {
        const data = await response.json()
        setError(data.error || "Could not create the wishlist")
      }
    } catch {
      setError("An error occurred while creating the wishlist")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear the error for this field when the user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Create a new wishlist</h2>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          The wishlist has been created! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="occasion"
            className="block text-sm font-medium text-gray-700"
          >
            Occasion
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.occasion ? "border-red-500" : ""
            }`}
            disabled={isSubmitting || success}
          >
            {occasionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldErrors.occasion && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.occasion}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={25}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.title ? "border-red-500" : ""
            }`}
            required
            disabled={isSubmitting || success}
          />
          {fieldErrors.title && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            maxLength={75}
            rows={3}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.description ? "border-red-500" : ""
            }`}
            disabled={isSubmitting || success}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || success}
        >
          {isSubmitting
            ? "Creating..."
            : success
              ? "Wishlist created!"
              : "Create wishlist"}
        </button>
      </form>
    </div>
  )
}
