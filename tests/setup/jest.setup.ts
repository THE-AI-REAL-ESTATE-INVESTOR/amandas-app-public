import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { server } from './msw'
import React from 'react'

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

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Configure MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

// Configure global test timeouts
jest.setTimeout(10000) 