import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '@/components/twc-ui/icon'

vi.mock('@hugeicons/react', () => ({
  HugeiconsIcon: vi.fn(({ icon, strokeWidth, className, ...props }: any) => {
    const strokeWidthValue = strokeWidth ? strokeWidth.toString() : '1.5'
    return (
      <div
        className={`h-4 w-4 shrink-0 ${className || ''}`}
        data-stroke-width={strokeWidthValue}
        {...props}
      >
        MockHugeIcon-{JSON.stringify(icon)}
      </div>
    )
  })
}))

vi.mock('lucide-react', () => ({
  icons: {}
}))

describe('Icon', () => {
  it('renders an Icon component', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toBeInTheDocument()
  })

  it('applies default strokeWidth of 1.5', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toHaveAttribute('data-stroke-width', '1.5')
  })

  it('applies custom strokeWidth', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} strokeWidth={2} />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toHaveAttribute('data-stroke-width', '2')
  })

  it('handles zero strokeWidth', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} strokeWidth={0} />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toBeInTheDocument()
    // strokeWidth={0} is falsy, so the component treats it as undefined
    // and uses the default value of 1.5 instead
    expect(icon).toHaveAttribute('data-stroke-width', '1.5')
  })

  it('handles undefined strokeWidth by using default', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} strokeWidth={undefined} />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('data-stroke-width', '1.5')
  })

  it('applies custom className', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} className="custom-icon-class" />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toHaveClass('custom-icon-class')
  })

  it('applies size classes', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} className="size-6" />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toHaveClass('size-6')
  })

  it('retains base Icon classes', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} />)

    const icon = screen.getByText('MockHugeIcon-[["path",{"d":"M10 10 L20 20"}]]')
    expect(icon).toHaveClass('shrink-0')
  })

  it('forwards additional props', () => {
    const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

    render(<Icon icon={mockHugeIcon} data-testid="test-icon" aria-hidden="true" />)

    const icon = screen.getByTestId('test-icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  describe('Different Icon Types', () => {
    it('renders with complex icon path', () => {
      const complexIcon = [
        ['path', { d: 'M10 10 L20 20' }],
        ['circle', { cx: '15', cy: '15', r: '5' }]
      ] as any

      render(<Icon icon={complexIcon} />)

      expect(
        screen.getByText(
          'MockHugeIcon-[["path",{"d":"M10 10 L20 20"}],["circle",{"cx":"15","cy":"15","r":"5"}]]'
        )
      ).toBeInTheDocument()
    })
  })

  describe('Styling Combinations', () => {
    it('combines strokeWidth, className, and custom props', () => {
      const mockHugeIcon = [['path', { d: 'M10 10 L20 20' }]] as any

      render(
        <Icon
          icon={mockHugeIcon}
          strokeWidth={3}
          className="size-8 text-blue-500"
          data-testid="styled-icon"
        />
      )

      const icon = screen.getByTestId('styled-icon')
      expect(icon).toHaveClass('text-blue-500', 'size-8', 'shrink-0')
      expect(icon).toHaveAttribute('data-stroke-width', '3')
    })
  })
})
