import { useState } from "react"
import { toast } from "react-hot-toast"

type AddExternalItemProps = {
  isOpen: boolean
  onClose: () => void
  wishlistId: string
  onItemAdded: () => void
}

export function AddExternalItem({
  isOpen,
  onClose,
  wishlistId,
  onItemAdded,
}: AddExternalItemProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    url: "",
    priority: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/wishlist/items/external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          url: formData.url,
          priority: formData.priority,
          wishlistId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add external item")
      }

      toast.success("External item added successfully!")
      onItemAdded()
      onClose()
    } catch {
      toast.error("Failed to add external item")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-base-100 p-6">
        <h2 className="mb-4 text-xl font-bold">Add External Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Item Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Description (Optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Price (kr)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">URL (Optional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Priority (Optional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
