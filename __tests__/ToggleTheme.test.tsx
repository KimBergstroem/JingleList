import "@testing-library/jest-dom"

import { fireEvent, render } from "@testing-library/react"

import ToggleTheme from "@/components/ui/ToggleTheme"

describe("ToggleTheme", () => {
  it("switches theme when the user clicks the button", () => {
    const { getByRole } = render(<ToggleTheme />)
    const toggleButton = getByRole("checkbox")

    expect(document.documentElement.getAttribute("data-theme")).toBe("sunset")

    fireEvent.click(toggleButton)

    expect(document.documentElement.getAttribute("data-theme")).toBe("pastel")
  })
})
