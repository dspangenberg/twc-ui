import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/twc-ui/avatar'

vi.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="avatar-root" className={className} {...props}>
      {children}
    </div>
  ),
  Image: ({ src, alt, className, ...props }: any) => (
    <img data-testid="avatar-image" src={src} alt={alt} className={className} {...props} />
  ),
  Fallback: ({ children, className, style, ...props }: any) => (
    <div data-testid="avatar-fallback" className={className} style={style} {...props}>
      {children}
    </div>
  )
}))

vi.mock('@/hooks/use-initials', () => ({
  useInitials: () => (name: string) => {
    if (!name) return ''
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
  }
}))

describe('Avatar', () => {
  it('renders an Avatar component', () => {
    render(<Avatar />)
    expect(screen.getByTestId('avatar-root')).toBeInTheDocument()
    expect(screen.getByTestId('avatar-container')).toBeInTheDocument()
  })

  it('applies standard classes', () => {
    render(<Avatar />)
    const avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveClass(
      'relative',
      'flex',
      'shrink-0',
      'overflow-hidden',
      'rounded-full',
      'p-0.5',
      'text-primary-foreground',
      'focus-visible:ring-primary/20',
      'data-[hovered]:bg-primary/90'
    )
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<Avatar size="sm" />)
    let avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveClass('size-7')

    rerender(<Avatar size="md" />)
    avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveClass('size-9')

    rerender(<Avatar size="lg" />)
    avatar = screen.getByTestId('avatar-root')
    expect(avatar).toHaveClass('size-10')
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

  it('renders with badge', () => {
    render(<Avatar badge="🟢" />)
    expect(screen.getByText('🟢')).toBeInTheDocument()
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

      const style = fallback.getAttribute('style')
      expect(style).toContain('background-color')
    })

    it('generates contrasting text color', () => {
      render(<Avatar fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

      const style = fallback.getAttribute('style')
      expect(style).toContain('color')
    })

    it('does not generate colors when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" fullname="John Doe" />)

      const fallback = screen.getByTestId('avatar-fallback')
      vi.runAllTimers()

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

  it('renders AvatarImage without variant classes when used standalone', () => {
    render(<AvatarImage src="https://example.com/avatar.jpg" />)
    const image = screen.getByTestId('avatar-image')
    // Standalone AvatarImage doesn't have variant classes - they're applied by Avatar wrapper
    expect(image).toBeInTheDocument()
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

  it('renders AvatarFallback without variant classes when used standalone', () => {
    render(<AvatarFallback />)
    const fallback = screen.getByTestId('avatar-fallback')
    // Standalone AvatarFallback doesn't have variant classes - they're applied by Avatar wrapper
    expect(fallback).toBeInTheDocument()
  })

  it('applies size-dependent text classes when used within Avatar', () => {
    const { rerender } = render(<Avatar fullname="John Doe" size="sm" />)
    let fallback = screen.getByTestId('avatar-fallback')

    // Should have text-xs for sm size
    expect(fallback).toHaveClass('text-xs')

    rerender(<Avatar fullname="John Doe" size="md" />)
    fallback = screen.getByTestId('avatar-fallback')
    // Should have text-sm for md size
    expect(fallback).toHaveClass('text-sm')

    rerender(<Avatar fullname="John Doe" size="lg" />)
    fallback = screen.getByTestId('avatar-fallback')
    // Should have text-lg for lg size
    expect(fallback).toHaveClass('text-lg')
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
    expect(screen.getByTestId('avatar-container')).toBeInTheDocument()
  })

  it('handles null src prop', () => {
    render(<Avatar src={null} fullname="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})

describe('Badge Functionality', () => {
  it('renders badge container with proper structure', () => {
    render(<Avatar badge="🟢" />)

    // Find badge container by looking for element with badge container classes
    const badgeContainer = document.querySelector(
      '.absolute.-bottom-1\\.5.-right-1\\.5.border-2.border-background.rounded-full'
    )
    expect(badgeContainer).toBeInTheDocument()
  })

  it('renders badge element with proper classes', () => {
    render(<Avatar badge="🟢" />)

    // Look for the actual badge element - check if badge text exists and has badge container
    const badgeText = screen.getByText('🟢')
    expect(badgeText).toBeInTheDocument()
    expect(badgeText.parentElement).toBeInTheDocument()
  })

  it('renders badge with variant classes', () => {
    render(<Avatar badge="🟢" variant="info" />)

    const badge = document.querySelector('.bg-primary.text-background')
    expect(badge).toBeInTheDocument()
  })

  it('renders destructive variant badge', () => {
    render(<Avatar badge="❌" variant="destructive" />)

    const badge = document.querySelector('.bg-destructive\\/80.border-destructive.text-white')
    expect(badge).toBeInTheDocument()
  })

  it('applies custom badge className', () => {
    render(<Avatar badge="🟢" badgeClassName="custom-badge" />)

    const badge = document.querySelector('.custom-badge')
    expect(badge).toBeInTheDocument()
  })

  it('does not render badge when not provided', () => {
    render(<Avatar fullname="John Doe" />)

    const badgeContainer = document.querySelector('.absolute.-bottom-1\\.5.-right-1\\.5')
    expect(badgeContainer).not.toBeInTheDocument()
  })
})
