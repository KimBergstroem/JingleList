import "@testing-library/jest-dom"

export {}

declare global {
  interface JestMatchers<R> {
    toBeInTheDocument(): R
  }
}
