export type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function calculateTimeUntilChristmas(): TimeLeft {
  const christmas = new Date("2024-12-24T00:00:00")
  const now = new Date()
  const difference = christmas.getTime() - now.getTime()

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
