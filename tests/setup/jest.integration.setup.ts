import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'node:util'
import { server } from './msw'
import React from 'react'

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
    return React.createElement('img', { src, alt, ...props })
  },
}))

// Suppress console errors during tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
