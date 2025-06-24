
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { configure } from '@testing-library/react'

// Configure React Testing Library to automatically wrap in act()
configure({
  testIdAttribute: 'data-testid',
  // This helps with React 18+ async rendering
  asyncUtilTimeout: 2000,
})

// Nur in Testumgebung ausführen
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'test') {
  // Mock für ResizeObserver (häufig benötigt für React-Komponenten)
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock für matchMedia (für responsive Tests)
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
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock für IntersectionObserver (für Tooltips)
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }))

  // Mock für requestAnimationFrame
  global.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
    return setTimeout(cb, 16)
  })

  global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
    clearTimeout(id)
  })
}
