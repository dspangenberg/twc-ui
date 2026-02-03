import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Select } from '@/components/twc-ui/select'

describe('Select Component', () => {
  const mockItems = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' }
  ]

  it('renders basic select button', () => {
    render(<Select items={mockItems} value="1" />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-rac', '')
  })

  it('renders with items and shows selected value', () => {
    render(<Select items={mockItems} value="1" />)

    // Get all elements with "Option 1" text and find the visible span
    const elements = screen.getAllByText('Option 1')
    const selectedSpan = elements.find(el => el.tagName === 'SPAN' && !el.closest('template'))
    expect(selectedSpan).toBeInTheDocument()
    expect(selectedSpan?.tagName).toBe('SPAN')
  })

  it('shows error when provided', () => {
    render(<Select items={mockItems} value="1" error="Test error" />)

    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-select-class'
    render(<Select items={mockItems} value="1" className={customClass} />)

    const container = screen.getByRole('button')
    expect(container).toBeInTheDocument()
    // The className is applied to the outer div, not the button
    const outerDiv = container.closest('div[data-rac]')
    expect(outerDiv).toHaveClass(customClass)
  })

  it('has proper button attributes', () => {
    render(<Select items={mockItems} value="1" />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-rac', '')
    expect(button).toHaveAttribute('aria-haspopup', 'listbox')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows custom error component', () => {
    const CustomError = ({ children }: { children?: React.ReactNode }) => (
      <div className="custom-error">{children}</div>
    )

    render(<Select items={mockItems} value="1" error="Custom error" errorComponent={CustomError} />)

    // There might be multiple instances, get the visible one
    const errorElements = screen.getAllByText('Custom error')
    const visibleError = errorElements.find(el => !el.closest('template'))
    expect(visibleError).toBeInTheDocument()
    expect(visibleError).toHaveClass('custom-error')
  })

  it('renders with label for accessibility', () => {
    render(<Select items={mockItems} value="1" label="Test Label" />)

    // The label appears with a colon and asterisk for required field
    expect(screen.getByText('Test Label:')).toBeInTheDocument()
    // No accessibility warning should appear for this test
  })
})
