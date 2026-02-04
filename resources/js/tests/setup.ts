import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import { vi } from 'vitest'

// Configure React Testing Library to automatically wrap in act()
configure({
  testIdAttribute: 'data-testid',
  // This helps with React 18+ async rendering
  asyncUtilTimeout: 2000
})

// Only run in test environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'test') {
  // Mock for ResizeObserver (frequently needed for React components)
  // global.ResizeObserver = vi.fn().mockImplementation(() => ({
  //   observe: vi.fn(),
  //   unobserve: vi.fn(),
  //   disconnect: vi.fn()
  // }))

  // Mock for matchMedia (for responsive tests)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })

  // Mock for IntersectionObserver (for tooltips)
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: []
  }))

  // Mock for requestAnimationFrame
  global.requestAnimationFrame = vi.fn().mockImplementation(cb => {
    return setTimeout(cb, 16)
  })

  global.cancelAnimationFrame = vi.fn().mockImplementation(id => {
    clearTimeout(id)
  })
}
