import { z } from "zod"

// Wishlist form validation schema
export const wishlistFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(25, "Title cannot exceed 25 characters"),
  description: z
    .string()
    .max(75, "Description cannot exceed 75 characters")
    .optional()
    .nullable(),
  occasion: z.enum(
    [
      "Christmas",
      "Birthday",
      "Father's Day",
      "Mother's Day",
      "Valentine's Day",
      "Other",
    ],
    {
      required_error: "Please select an occasion",
    }
  ),
})

// Wishlist item form validation schema
export const wishlistItemFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(25, "Title cannot exceed 25 characters"),
  description: z
    .string()
    .max(150, "Description cannot exceed 150 characters")
    .optional()
    .nullable(),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price is too high"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .max(500, "URL is too long")
    .optional()
    .nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Please select a priority level",
  }),
})

// Types based on the schemas
export type WishlistFormData = z.infer<typeof wishlistFormSchema>
export type WishlistItemFormData = z.infer<typeof wishlistItemFormSchema>

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Array<{ field: string; message: string }> }

// Helper function to validate wishlist form
export function validateWishlistForm(
  data: unknown
): ValidationResult<WishlistFormData> {
  const result = wishlistFormSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }))
    return { success: false, errors }
  }
  return { success: true, data: result.data }
}

// Helper function to validate wishlist item form
export function validateWishlistItemForm(
  data: unknown
): ValidationResult<WishlistItemFormData> {
  const result = wishlistItemFormSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }))
    return { success: false, errors }
  }
  return { success: true, data: result.data }
}
