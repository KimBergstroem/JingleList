"use client"

import { CSSProperties, useEffect, useState } from "react"

import { calculateTimeUntilChristmas, TimeLeft } from "@/lib/utils/time"

function CountDown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeUntilChristmas()
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeUntilChristmas())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid auto-cols-max grid-flow-col gap-5 text-center">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": timeLeft.days } as CSSProperties}></span>
        </span>
        days
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": timeLeft.hours } as CSSProperties}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": timeLeft.minutes } as CSSProperties}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": timeLeft.seconds } as CSSProperties}></span>
        </span>
        sec
      </div>
    </div>
  )
}

export default CountDown
