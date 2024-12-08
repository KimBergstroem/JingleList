import "@testing-library/jest-dom"

import type { ImageProps } from "next/image"
import { render, screen } from "@testing-library/react"

import LandingPage from "@/app/landing-page/page"

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: ImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt} {...props} />
  ),
}))

describe("LandingPage", () => {
  it("renders the main heading and get started button", () => {
    render(<LandingPage />)

    expect(screen.getByText("Create your wishlist easily!")).toBeInTheDocument()
    expect(screen.getByText("Get started")).toBeInTheDocument()
    expect(screen.getByText("Free to use!")).toBeInTheDocument()
  })
})
