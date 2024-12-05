"use client"

import { useEffect, useState } from "react"

import { MoonIcon, SunIcon } from "./icons"

function ToggleTheme() {
  const [theme, setTheme] = useState("sunset")

  useEffect(() => {
    // Hämta sparat tema från localStorage eller använd default
    const savedTheme = localStorage.getItem("theme") || "sunset"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "sunset" ? "pastel" : "sunset"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <div className="mx-4">
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          checked={theme === "pastel"}
          onChange={toggleTheme}
          className="hidden"
        />
        <SunIcon />
        <MoonIcon />
      </label>
    </div>
  )
}

export default ToggleTheme
