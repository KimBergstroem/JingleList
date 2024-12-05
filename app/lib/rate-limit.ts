const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function rateLimit(key: string, maxAttempts: number): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window

  const entry = rateLimitMap.get(key)

  if (!entry || now - entry.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return true
  }

  if (entry.count >= maxAttempts) {
    return false
  }

  entry.count++
  return true
}
