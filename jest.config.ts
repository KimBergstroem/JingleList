import nextJest from "next/jest.js"
import type { Config } from "jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(jose)/)"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
}

export default createJestConfig(config)
