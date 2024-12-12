"use client"

import { CSSProperties, useEffect, useState } from "react"

import { calculateTimeUntilChristmas, TimeLeft } from "@/lib/utils/time"

function CountDown() {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeUntilChristmas())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeUntilChristmas())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="grid auto-cols-max grid-flow-col gap-2 sm:gap-3 md:gap-5">
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
          <span style={{ "--value": timeLeft.days } as CSSProperties}></span>
        </span>
        <span className="text-xs sm:text-sm">days</span>
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
          <span style={{ "--value": timeLeft.hours } as CSSProperties}></span>
        </span>
        <span className="text-xs sm:text-sm">hours</span>
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
          <span style={{ "--value": timeLeft.minutes } as CSSProperties}></span>
        </span>
        <span className="text-xs sm:text-sm">min</span>
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl sm:text-4xl md:text-5xl">
          <span style={{ "--value": timeLeft.seconds } as CSSProperties}></span>
        </span>
        <span className="text-xs sm:text-sm">sec</span>
      </div>
    </div>
  )
}

export default CountDown
