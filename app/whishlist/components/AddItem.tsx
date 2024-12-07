"use client"

import { useEffect, useState } from "react"

import { validateWishlistItemForm } from "@/lib/utils/form-validation"

type FormData = {
  title: string
  description: string
  price: string
  url: string
  priority: "LOW" | "MEDIUM" | "HIGH"
}

type FormErrors = {
  [key: string]: string
}

const initialFormData: FormData = {
  title: "",
  description: "",
  price: "",
  url: "",
  priority: "MEDIUM",
}

interface AddItemProps {
  wishlistId: string
  onItemAdded?: () => void
}

export default function AddItem({ wishlistId, onItemAdded }: AddItemProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [error, setError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    setIsSubmitting(true)

    // Convert formData to the correct format for validation
    const dataToValidate: unknown = {
      ...formData,
      price: Number(formData.price),
      description: formData.description || null,
      url: formData.url || null,
    }

    // Validate data
    const validationResult = validateWishlistItemForm(dataToValidate)
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
      const response = await fetch("/api/wishlist/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validationResult.data,
          wishlistId,
        }),
      })

      if (response.ok) {
        setFormData(initialFormData)
        setSuccess("Item added successfully!")
        onItemAdded?.()
      } else {
        const data = await response.json()
        setError(data.error || "Could not add the item")
      }
    } catch {
      setError("An error occurred while adding the item")
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
      <h2 className="mb-6 text-2xl font-bold">Add desired item</h2>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isSubmitting}
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
            value={formData.description}
            onChange={handleChange}
            maxLength={150}
            rows={3}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.description ? "border-red-500" : ""
            }`}
            disabled={isSubmitting}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            max={10000}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.price ? "border-red-500" : ""
            }`}
            required
            disabled={isSubmitting}
          />
          {fieldErrors.price && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            maxLength={500}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.url ? "border-red-500" : ""
            }`}
            disabled={isSubmitting}
          />
          {fieldErrors.url && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.url}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              fieldErrors.priority ? "border-red-500" : ""
            }`}
            disabled={isSubmitting}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {fieldErrors.priority && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.priority}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding item..." : "Add item"}
        </button>
      </form>
    </div>
  )
}
