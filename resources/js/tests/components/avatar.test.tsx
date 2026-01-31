import { render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock @radix-ui/react-avatar
vi.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div data-slot="avatar" className={className} {...props} data-testid="avatar-root">
      {children}
    </div>
  ),
  Image: ({ src, alt, className, ...props }: any) => (
    <img src={src} alt={alt} className={className} {...props} data-testid="avatar-image" />
  ),
  Fallback: ({ children, className, ...props }: any) => (
    <div className={className} {...props} data-testid="avatar-fallback">
      {children}
    </div>
  )
}))

import { Avatar, AvatarFallback, AvatarImage, AvatarRoot } from '@/components/twc-ui/avatar'

describe('Avatar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders Avatar with default props', () => {
      render(<Avatar />)

      const container = screen.getByTestId('avatar-container')
      const root = screen.getByTestId('avatar-root')
      expect(container).toBeInTheDocument()
      expect(root).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Avatar className="custom-avatar" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('custom-avatar')
    })

    it('renders container with correct structure', () => {
      render(<Avatar />)

      const container = screen.getByTestId('avatar-container')
      const root = container.querySelector('[data-slot="avatar"]')
      expect(container).toHaveClass('rounded-full', 'border', 'border-border')
      expect(root).toBeInTheDocument()
    })
  })

  describe('Size Variations', () => {
    it('renders small size correctly', () => {
      render(<Avatar size="sm" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('size-7')
    })

    it('renders medium size correctly (default)', () => {
      render(<Avatar />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('size-8')
    })

    it('renders medium size explicitly', () => {
      render(<Avatar size="md" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('size-8')
    })

    it('renders large size correctly', () => {
      render(<Avatar size="lg" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('size-10')
    })

    it('applies correct fallback font sizes', () => {
      const { rerender } = render(<Avatar size="sm" initials="AB" />)

      let fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveClass('text-xs')

      rerender(<Avatar size="md" initials="AB" />)
      fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveClass('text-sm')

      rerender(<Avatar size="lg" initials="AB" />)
      fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveClass('text-lg')
    })
  })

  describe('Image Handling', () => {
    it('renders image when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" fullname="John Doe" />)

      const image = screen.getByTestId('avatar-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg')
      expect(image).toHaveAttribute('alt', 'John Doe')
    })

    it('renders fallback when src is null', () => {
      render(<Avatar src={null} fullname="John Doe" />)

      const image = screen.getByTestId('avatar-image')
      const fallback = screen.getByTestId('avatar-fallback')
      expect(image).toBeInTheDocument()
      expect(image).not.toHaveAttribute('src') // null means no src attribute
      expect(fallback).toBeInTheDocument()
    })

    it('renders fallback when src is undefined', () => {
      render(<Avatar fullname="John Doe" />)

      const image = screen.queryByTestId('avatar-image')
      const fallback = screen.getByTestId('avatar-fallback')
      // When src is undefined, the AvatarImage still renders but with undefined src
      expect(image).toBeInTheDocument()
      expect(fallback).toBeInTheDocument()
    })

    it('applies correct image classes', () => {
      render(<Avatar src="https://example.com/avatar.jpg" />)

      const image = screen.getByTestId('avatar-image')
      expect(image).toHaveClass('aspect-square', 'size-full')
    })
  })

  describe('Initials and Fullname', () => {
    it('displays provided initials', () => {
      render(<Avatar initials="JD" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('JD')
    })

    it('generates initials from fullname', () => {
      render(<Avatar fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('JD')
    })

    it('handles complex fullname correctly', () => {
      render(<Avatar fullname="John Michael Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('JMD')
    })

    it('uses initials when both provided', () => {
      render(<Avatar fullname="John Doe" initials="Custom" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('Custom')
    })

    it('handles empty fullname', () => {
      render(<Avatar fullname="" initials="AB" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('AB')
    })

    it('handles single word fullname', () => {
      render(<Avatar fullname="John" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('J')
    })
  })

  describe('Color Generation', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('generates background color from fullname', () => {
      render(<Avatar fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      // Should have generated background color (check if style property exists)
      const style = fallback.getAttribute('style')
      expect(style).toContain('background-color')
    })

    it('generates contrasting text color', () => {
      render(<Avatar fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      // Should have contrasting text color
      const style = fallback.getAttribute('style')
      expect(style).toContain('color')
    })

    it('does not generate colors when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      // Fallback should exist but not have generated colors
      expect(fallback).toBeInTheDocument()
      const style = fallback.getAttribute('style') || ''
      expect(style).not.toContain('background-color')
    })

    it('does not generate colors when fullname is empty', () => {
      render(<Avatar fullname="" initials="JD" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      const style = fallback.getAttribute('style') || ''
      expect(style).not.toContain('background-color')
    })

    it('updates colors when fullname changes', () => {
      const { rerender } = render(<Avatar fullname="John Doe" />)

      let fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      const initialBgColor = fallback.style.backgroundColor
      const initialTextColor = fallback.style.color

      rerender(<Avatar fullname="Jane Smith" />)
      fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      const newBgColor = fallback.style.backgroundColor
      const newTextColor = fallback.style.color

      expect(newBgColor).not.toBe(initialBgColor)
      expect(newTextColor).not.toBe(initialTextColor)
    })
  })

  describe('Props Handling', () => {
    it('passes through additional props to AvatarRoot', () => {
      render(<Avatar data-testid="custom-avatar" aria-label="User Avatar" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveAttribute('aria-label', 'User Avatar')
    })

    it('merges className correctly', () => {
      render(<Avatar className="custom-class another-class" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('custom-class', 'another-class')
    })

    it('applies correct default classes', () => {
      render(<Avatar />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveClass('rounded-full', 'border-2', 'border-transparent', 'size-8')
    })
  })

  describe('Component Composition', () => {
    it('renders subcomponents with correct structure within Avatar', () => {
      render(<Avatar fullname="John Doe" />)

      // Check that all subcomponents are rendered with correct data-slot attributes
      const root = screen.getByTestId('avatar-root')
      const image = screen.getByTestId('avatar-image')
      const fallback = screen.getByTestId('avatar-fallback')

      expect(root).toBeInTheDocument()
      expect(image).toBeInTheDocument()
      expect(fallback).toBeInTheDocument()
      expect(root).toHaveAttribute('data-slot', 'avatar')
      expect(image).toHaveAttribute('data-slot', 'avatar-image')
      expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      render(<Avatar fullname={undefined} initials={undefined} />)

      const container = screen.getByTestId('avatar-container')
      expect(container).toBeInTheDocument()
    })

    it('handles null src gracefully', () => {
      render(<Avatar src={null} fullname="John Doe" />)

      const image = screen.getByTestId('avatar-image')
      const fallback = screen.getByTestId('avatar-fallback')
      expect(image).toBeInTheDocument()
      expect(image).not.toHaveAttribute('src') // null means no src attribute
      expect(fallback).toBeInTheDocument()
    })

    it('handles empty string initials', () => {
      render(<Avatar initials="" fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('JD') // Should use fullname instead
    })

    it('handles whitespace in fullname', () => {
      render(<Avatar fullname="  John  Doe  " />)

      const fallback = screen.getByTestId('avatar-fallback')
      expect(fallback).toHaveTextContent('JD')
    })

    it('handles special characters in fullname', () => {
      render(<Avatar fullname="John-Doe Smith" />)

      const fallback = screen.getByTestId('avatar-fallback')
      // The logic takes n[0] from each word, so "John-Doe" becomes "J" and "Smith" becomes "S"
      expect(fallback).toHaveTextContent('JS')
    })
  })

  describe('Accessibility', () => {
    it('applies alt attribute to image when fullname provided', () => {
      render(<Avatar src="test.jpg" fullname="John Doe" />)

      const image = screen.getByTestId('avatar-image')
      expect(image).toHaveAttribute('alt', 'John Doe')
    })

    it('passes through ARIA attributes', () => {
      render(<Avatar aria-label="User Avatar" aria-describedby="avatar-desc" />)

      const root = screen.getByTestId('avatar-root')
      expect(root).toHaveAttribute('aria-label', 'User Avatar')
      expect(root).toHaveAttribute('aria-describedby', 'avatar-desc')
    })
  })
})
