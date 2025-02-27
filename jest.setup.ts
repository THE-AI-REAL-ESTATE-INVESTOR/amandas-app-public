// Polyfills must come first
import { TextEncoder, TextDecoder } from 'util'

// Setup TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Ensure these are available in the global scope
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as any
}

// Now we can safely import other dependencies
import '@testing-library/jest-dom'
import React from 'react'

// Import MSW after polyfills are set up
import { server } from './tests/setup/msw'

// Mock Next.js components and hooks
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
    return React.createElement('img', { src, alt, ...props })
  },
}))

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

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  auth() {
    return {
      userId: 'test_user_123',
      getToken: () => 'test_token',
    }
  },
  currentUser() {
    return {
      id: 'test_user_123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    }
  },
  clerkClient: {
    users: {
      getUser: () => ({
        id: 'test_user_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      }),
    },
  },
}))

// Setup browser-like environment for jsdom tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Configure MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

// Configure global test timeouts
jest.setTimeout(10000)

// Add custom matchers
expect.extend({
  toHaveBeenCalledWithMatch(received, ...expected) {
    const pass = this.equals(
      received.mock.calls[0],
      expected
    )
    return {
      pass,
      message: () => `expected ${received} to have been called with ${expected}`,
    }
  },
})

// Mock console.error and console.warn
const originalError = console.error
const originalWarn = console.warn

// Log errors and warnings but don't fail tests
console.error = (...args: any[]) => {
  originalError(...args)
}

console.warn = (...args: any[]) => {
  originalWarn(...args)
}

// Cleanup console mocks
afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
