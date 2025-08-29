import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock global fetch
global.fetch = vi.fn()

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})