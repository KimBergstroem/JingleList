import "@testing-library/jest-dom"

import * as React from "react"
import { render } from "@testing-library/react"

import CountDown from "@/components/ui/CountDown"

describe("CountDown", () => {
  it("renders the countdown component with all time elements", () => {
    const { getByText } = render(<CountDown />)

    // Check that all time elements exist
    expect(getByText(/days/i)).toBeInTheDocument()
    expect(getByText(/hours/i)).toBeInTheDocument()
    expect(getByText(/min/i)).toBeInTheDocument()
    expect(getByText(/sec/i)).toBeInTheDocument()
  })
})
