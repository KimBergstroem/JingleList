type RateLimitStore = {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {} // Initialize an empty object to store rate limit data in memory

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60000
) {
  const now = Date.now()
  const record = store[key]

  if (!record) {
    store[key] = {
      count: 1,
      resetAt: now + windowMs,
    }
    return true
  }

  if (now > record.resetAt) {
    store[key] = {
      count: 1,
      resetAt: now + windowMs,
    }
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}
