import daisyui from "daisyui"
import type { Config } from "tailwindcss"

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["sunset", "pastel"],
  },
  safelist: [
    "btn",
    "btn-accent",
    "btn-ghost",
    "container-wrapper",
    "theme-controller",
  ],
} satisfies Config
