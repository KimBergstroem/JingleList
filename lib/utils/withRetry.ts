const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && (error as Error).message.includes("connection pool")) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return withRetry(operation, retries - 1, delay * 2)
    }
    throw error
  }
}
