import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/twc-ui/avatar'

vi.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="avatar-root" className={className} {...props}>
      {children}
    </div>
  ),
  Image: ({ src, alt, ...props }: any) => (
    <img data-testid="avatar-image" src={src} alt={alt} {...props} />
  ),
  Fallback: ({ children, className, ...props }: any) => (
    <div data-testid="avatar-fallback" className={className} {...props}>
      {children}
    </div>
  )
}))

describe('Avatar', () => {
  it('renders an Avatar component', () => {
    render(<Avatar />)
    expect(screen.getByTestId('avatar-root')).toBeInTheDocument()
  })

  it('applies standard classes', () => {
    render(<Avatar />)
    const avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveClass(
      'relative',
      'flex',
      'size-9',
      'shrink-0',
      'overflow-hidden',
      'rounded-full'
    )
  })

  it('applies custom className', () => {
    render(<Avatar className="custom-avatar-class" />)
    const avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveClass('custom-avatar-class')
  })

  it('renders children correctly', () => {
    render(
      <Avatar>
        <div data-testid="avatar-child">Child Content</div>
      </Avatar>
    )
    expect(screen.getByTestId('avatar-child')).toBeInTheDocument()
  })

  it('renders with src prop', () => {
    render(<Avatar src="https://example.com/avatar.jpg" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('renders with fullname and generates initials', () => {
    render(<Avatar fullname="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('uses custom initials when provided', () => {
    render(<Avatar fullname="John Doe" initials="XY" />)
    expect(screen.getByText('XY')).toBeInTheDocument()
    expect(screen.queryByText('JD')).not.toBeInTheDocument()
  })

  it('renders only initials prop when no fullname', () => {
    render(<Avatar initials="AB" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('generates single initial from single name', () => {
    render(<Avatar fullname="Madonna" />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('generates two initials from full name', () => {
    render(<Avatar fullname="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('handles empty fullname gracefully', () => {
    render(<Avatar fullname="" />)
    const fallback = screen.getByTestId('avatar-fallback')
    expect(fallback).toBeInTheDocument()
  })

  it('renders image and fallback together', () => {
    render(<Avatar src="https://example.com/avatar.jpg" fullname="John Doe" />)
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument()
    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument()
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
      // Run timers to allow any async color generation to complete
      vi.runAllTimers()

      // Should have generated a background color based on the fullname hash
      const style = fallback.getAttribute('style')
      expect(style).toContain('background-color')
    })

    it('generates contrasting text color', () => {
      render(<Avatar fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      // Should have generated a contrasting text color for readability
      const style = fallback.getAttribute('style')
      expect(style).toContain('color')
    })

    it('does not generate colors when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      // Run timers to ensure any async operations complete
      vi.runAllTimers()

      // When an image source is provided, the fallback should not generate
      // colors since the image will be displayed instead
      expect(fallback).toBeInTheDocument()
      const style = fallback.getAttribute('style') || ''
      expect(style).not.toContain('background-color')
    })

    it('does not generate colors when fullname is empty', () => {
      render(<Avatar fullname="" initials="JD" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      // Without a fullname, there's no seed for color generation
      const style = fallback.getAttribute('style') || ''
      expect(style).not.toContain('background-color')
    })

    it('updates colors when fullname changes', () => {
      const { rerender } = render(<Avatar fullname="John Doe" />)

      let fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      const initialBgColor = fallback.style.backgroundColor
      const initialTextColor = fallback.style.color

      // Rerender with a different fullname to trigger new color generation
      rerender(<Avatar fullname="Jane Smith" />)
      fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      const newBgColor = fallback.style.backgroundColor
      const newTextColor = fallback.style.color

      // Different fullnames should generate different color combinations
      expect(newBgColor).not.toBe(initialBgColor)
      expect(newTextColor).not.toBe(initialTextColor)
    })
  })
})

describe('AvatarImage', () => {
  it('renders an AvatarImage component', () => {
    render(<AvatarImage src="https://example.com/avatar.jpg" alt="Avatar" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toBeInTheDocument()
  })

  it('applies src attribute', () => {
    render(<AvatarImage src="https://example.com/avatar.jpg" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('applies alt attribute', () => {
    render(<AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveAttribute('alt', 'User Avatar')
  })

  it('applies standard classes', () => {
    render(<AvatarImage src="https://example.com/avatar.jpg" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveClass('aspect-square', 'size-full')
  })

  it('applies custom className', () => {
    render(<AvatarImage src="https://example.com/avatar.jpg" className="custom-image-class" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveClass('custom-image-class')
  })
})

describe('AvatarFallback', () => {
  it('renders an AvatarFallback component', () => {
    render(<AvatarFallback />)
    const fallback = screen.getByTestId('avatar-fallback')
    expect(fallback).toBeInTheDocument()
  })

  it('applies standard classes', () => {
    render(<AvatarFallback />)
    const fallback = screen.getByTestId('avatar-fallback')
    expect(fallback).toHaveClass(
      'flex',
      'size-full',
      'items-center',
      'justify-center',
      'rounded-full',
      'bg-muted',
      'text-xs',
      'font-medium',
      'uppercase'
    )
  })

  it('applies custom className', () => {
    render(<AvatarFallback className="custom-fallback-class" />)
    const fallback = screen.getByTestId('avatar-fallback')
    expect(fallback).toHaveClass('custom-fallback-class')
  })

  it('renders children correctly', () => {
    render(<AvatarFallback>AB</AvatarFallback>)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('supports ARIA attributes', () => {
    render(<Avatar fullname="John Doe" aria-label="User profile picture" />)
    const avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveAttribute('aria-label', 'User profile picture')
  })

  it('provides alt text for images', () => {
    render(<Avatar src="https://example.com/avatar.jpg" fullname="John Doe" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveAttribute('alt', 'John Doe')
  })

  it('uses custom alt text when provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Custom Alt Text" />)
    const image = screen.getByTestId('avatar-image')
    expect(image).toHaveAttribute('alt', 'Custom Alt Text')
  })
})

describe('Edge Cases', () => {
  it('handles very long names', () => {
    render(<Avatar fullname="Christopher Bartholomew" />)
    expect(screen.getByText('CB')).toBeInTheDocument()
  })

  it('handles names with special characters', () => {
    render(<Avatar fullname="Jean-Claude Van Damme" />)
    expect(screen.getByText('JV')).toBeInTheDocument()
  })

  it('handles single character names', () => {
    render(<Avatar fullname="X" />)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('handles names with extra spaces', () => {
    render(<Avatar fullname="  John   Doe  " />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders without any props', () => {
    render(<Avatar />)
    expect(screen.getByTestId('avatar-root')).toBeInTheDocument()
  })
})
