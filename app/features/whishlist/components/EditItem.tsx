import { useState } from "react"
import { toast } from "react-hot-toast"

import { validateWishlistItemForm } from "@/lib/utils/form-validation"

type WishlistItem = {
  id: string
  title: string
  description: string | null
  price: number
  url: string | null
  priority: "LOW" | "MEDIUM" | "HIGH" | null
  purchased: boolean
  purchasedBy?: string | null
}

type FormErrors = {
  [key: string]: string
}

interface EditItemProps {
  itemId: string
  initialData: {
    title: string
    description: string | null
    price: number | null
    url: string | null
    priority: string | null
    purchased: boolean
  }
  isOpen: boolean
  onClose: () => void
  onEdit: (itemId: string, data: WishlistItem) => void
}

type FormData = {
  title: string
  description: string
  price: number
  url: string
  priority: "LOW" | "MEDIUM" | "HIGH"
}

export default function EditItem({
  itemId,
  initialData,
  isOpen,
  onClose,
  onEdit,
}: EditItemProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData.title,
    description: initialData.description ?? "",
    price: initialData.price ?? 0,
    url: initialData.url ?? "",
    priority: (initialData.priority as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
  })
  const [error, setError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    setIsSubmitting(true)

    const dataToValidate = {
      ...formData,
      price: Number(formData.price),
      description: formData.description || null,
      url: formData.url || null,
    }

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
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      })

      if (!response.ok) {
        throw new Error("Failed to update item")
      }

      const updatedItem = await response.json()
      onEdit(itemId, updatedItem)
      onClose()
      toast.success("Item updated successfully!")
    } catch (error) {
      console.error("Error updating item:", error)
      setError("Failed to update item")
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
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-base-100 p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Item</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded border border-error/20 bg-error/10 px-4 py-3 text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={25}
                className={`input input-bordered w-full ${
                  fieldErrors.title ? "input-error" : ""
                }`}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-error">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium">
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
                className={`input input-bordered w-full ${
                  fieldErrors.price ? "input-error" : ""
                }`}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.price && (
                <p className="mt-1 text-sm text-error">{fieldErrors.price}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={150}
              rows={3}
              className={`textarea textarea-bordered w-full ${
                fieldErrors.description ? "textarea-error" : ""
              }`}
              disabled={isSubmitting}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-error">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              maxLength={500}
              className={`input input-bordered w-full ${
                fieldErrors.url ? "input-error" : ""
              }`}
              disabled={isSubmitting}
            />
            {fieldErrors.url && (
              <p className="mt-1 text-sm text-error">{fieldErrors.url}</p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`select select-bordered w-full ${
                fieldErrors.priority ? "select-error" : ""
              }`}
              disabled={isSubmitting}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {fieldErrors.priority && (
              <p className="mt-1 text-sm text-error">{fieldErrors.priority}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
