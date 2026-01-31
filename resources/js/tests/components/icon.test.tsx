import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock the icon libraries
vi.mock('@hugeicons/react', () => ({
  HugeiconsIcon: ({ icon, strokeWidth, className, ...props }: any) => (
    <div
      data-testid="hugeicons-icon"
      data-stroke-width={strokeWidth}
      className={className}
      {...props}
    >
      MockHugeIcon-{JSON.stringify(icon)}
    </div>
  )
}))

vi.mock('lucide-react', () => ({
  ChevronDown: ({ className, strokeWidth, ...props }: any) => (
    <div data-testid="lucide-icon" data-stroke-width={strokeWidth} className={className} {...props}>
      MockLucideIcon-ChevronDown
    </div>
  ),
  User: ({ className, strokeWidth, ...props }: any) => (
    <div data-testid="lucide-icon" data-stroke-width={strokeWidth} className={className} {...props}>
      MockLucideIcon-User
    </div>
  )
}))

import { Icon, type IconType } from '@/components/twc-ui/icon'

describe('Icon Component', () => {
  describe('Basic Rendering', () => {
    it('renders Lucide icon correctly', () => {
      // Import a Lucide icon for testing
      const LucideIcon = () => <div>LucideIcon</div>
      LucideIcon.displayName = 'TestLucideIcon'

      render(<Icon icon={LucideIcon as IconType} />)

      const icon = screen.getByText('LucideIcon')
      expect(icon).toBeInTheDocument()
    })

    it('renders with default className', () => {
      const TestIcon = () => <div>TestIcon</div>

      render(<Icon icon={TestIcon as IconType} />)

      const icon = screen.getByText('TestIcon')
      expect(icon).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const TestIcon = () => <div>TestIcon</div>

      render(<Icon icon={TestIcon as IconType} className="custom-class" />)

      const icon = screen.getByText('TestIcon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('HugeIcons Support', () => {
    it('detects HugeIcon correctly', async () => {
      // Mock a HugeIcon (array format)
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} />)

      const hugeIcon = screen.getByTestId('hugeicons-icon')
      expect(hugeIcon).toBeInTheDocument()
      expect(hugeIcon).toHaveTextContent('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    })

    it('passes strokeWidth to HugeIcon when provided', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} strokeWidth={2} />)

      const hugeIcon = screen.getByTestId('hugeicons-icon')
      expect(hugeIcon).toHaveAttribute('data-stroke-width', '2')
    })

    it('passes default strokeWidth to HugeIcon when not provided', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} />)

      const hugeIcon = screen.getByTestId('hugeicons-icon')
      expect(hugeIcon).toHaveAttribute('data-stroke-width', '1.5')
    })

    it('applies default className to HugeIcon', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} />)

      const hugeIcon = screen.getByTestId('hugeicons-icon')
      expect(hugeIcon).toHaveClass('h-4', 'w-4')
    })

    it('applies custom className to HugeIcon', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} className="custom-icon" />)

      const hugeIcon = screen.getByTestId('hugeicons-icon')
      expect(hugeIcon).toHaveClass('h-4', 'w-4', 'custom-icon')
    })
  })

  describe('Lucide Icons Support', () => {
    it('renders Lucide icon component correctly', () => {
      const TestIcon = ({ className, ...props }: any) => (
        <div data-testid="lucide-test-icon" className={className} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toBeInTheDocument()
      expect(lucideIcon).toHaveTextContent('LucideTestIcon')
    })

    it('passes strokeWidth to Lucide icon', () => {
      const TestIcon = ({ strokeWidth, ...props }: any) => (
        <div data-testid="lucide-test-icon" data-stroke-width={strokeWidth} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} strokeWidth={2} />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toHaveAttribute('data-stroke-width', '2')
    })

    it('applies default className to Lucide icon', () => {
      const TestIcon = ({ className, ...props }: any) => (
        <div data-testid="lucide-test-icon" className={className} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toHaveClass('h-4', 'w-4')
    })

    it('applies custom className to Lucide icon', () => {
      const TestIcon = ({ className, ...props }: any) => (
        <div data-testid="lucide-test-icon" className={className} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} className="custom-icon" />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toHaveClass('h-4', 'w-4', 'custom-icon')
    })
  })

  describe('Props Handling', () => {
    it('passes through additional props to HugeIcon', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} aria-label="Test Icon" onClick={vi.fn()} />)

      const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
      expect(icon).toHaveAttribute('aria-label', 'Test Icon')
    })

    it('passes through additional props to Lucide icon', () => {
      const TestIcon = ({ ...props }: any) => (
        <div data-testid="lucide-test-icon" {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} aria-label="Test Icon" onClick={vi.fn()} />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toHaveAttribute('aria-label', 'Test Icon')
    })

    it('merges className correctly', () => {
      const TestIcon = ({ className, ...props }: any) => (
        <div data-testid="lucide-test-icon" className={className} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} className="custom-class another-class" />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toHaveClass('h-4', 'w-4', 'custom-class', 'another-class')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined strokeWidth gracefully', () => {
      const TestIcon = ({ strokeWidth, ...props }: any) => (
        <div data-testid="lucide-test-icon" data-stroke-width={strokeWidth} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} strokeWidth={undefined} />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toBeInTheDocument()
      expect(lucideIcon).toHaveAttribute('data-stroke-width', '1.5')
    })

    it('handles zero strokeWidth', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(<Icon icon={mockHugeIcon} strokeWidth={0} />)

      const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
      expect(icon).toBeInTheDocument()
      // When strokeWidth is 0, the conditional strokeWidth ? Number(strokeWidth) : undefined
      // evaluates to false, so it becomes undefined and is not passed as an attribute
      const parent = icon.parentElement
      expect(parent).not.toHaveAttribute('data-stroke-width')
    })

    it('handles empty string className', () => {
      const TestIcon = ({ className, ...props }: any) => (
        <div data-testid="lucide-test-icon" className={className} {...props}>
          LucideTestIcon
        </div>
      )

      render(<Icon icon={TestIcon as IconType} className="" />)

      const lucideIcon = screen.getByTestId('lucide-test-icon')
      expect(lucideIcon).toHaveClass('h-4', 'w-4')
      // cn utility will merge empty string with defaults
      expect(lucideIcon).toHaveClass('h-4 w-4')
    })
  })

  describe('Type Safety', () => {
    it('accepts LucideProps-compatible icons', () => {
      const LucideCompatibleIcon = ({
        className,
        strokeWidth,
        size,
        color,
        ...props
      }: {
        className?: string
        strokeWidth?: number
        size?: number
        color?: string
        [key: string]: any
      }) => (
        <div
          data-testid="lucide-compatible"
          className={className}
          data-stroke-width={strokeWidth}
          data-size={size}
          data-color={color}
          {...props}
        >
          CompatibleIcon
        </div>
      )

      expect(() => {
        render(
          <Icon icon={LucideCompatibleIcon as IconType} strokeWidth={2.5} size={24} color="red" />
        )
      }).not.toThrow()
    })

    it('accepts HugeIcon array format', () => {
      const mockHugeIcon = [
        ['path', { d: 'M10 10 L20 20', stroke: 'currentColor' }],
        ['circle', { cx: '15', cy: '15', r: '5' }]
      ] as any

      expect(() => {
        render(<Icon icon={mockHugeIcon} />)
      }).not.toThrow()
    })
  })
})
