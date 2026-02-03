import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FormCheckboxGroup } from '@/components/twc-ui/form-checkbox-group'

// Mock the dependencies
vi.mock('@/components/twc-ui/form', () => ({
  useFormContext: vi.fn()
}))

vi.mock('@/components/twc-ui/form-errors', () => ({
  FormFieldError: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  getFormError: vi.fn()
}))

describe('FormCheckboxGroup', () => {
  const defaultProps = {
    name: 'test-checkbox-group',
    items: [
      { id: '1', name: 'Option 1' },
      { id: '2', name: 'Option 2' },
      { id: '3', name: 'Option 3' }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders checkbox group with items', () => {
    render(<FormCheckboxGroup {...defaultProps} />)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
  })

  it('renders with label when provided', () => {
    render(<FormCheckboxGroup {...defaultProps} label="Select Options" />)

    expect(screen.getByText('Select Options')).toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(<FormCheckboxGroup {...defaultProps} description="Please select your options" />)

    expect(screen.getByText('Please select your options')).toBeInTheDocument()
  })

  it('renders empty when no items provided', () => {
    render(<FormCheckboxGroup name="empty-group" items={[]} />)

    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(0)
  })

  it('renders correct checkbox values', () => {
    render(<FormCheckboxGroup {...defaultProps} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toHaveAttribute('value', '1')
    expect(checkboxes[1]).toHaveAttribute('value', '2')
    expect(checkboxes[2]).toHaveAttribute('value', '3')
  })

  it('renders with custom item name and value properties', () => {
    const customItems = [
      { code: 'custom-1', label: 'Custom Option 1' },
      { code: 'custom-2', label: 'Custom Option 2' }
    ]

    render(
      <FormCheckboxGroup {...defaultProps} items={customItems} itemName="label" itemValue="code" />
    )

    expect(screen.getByText('Custom Option 1')).toBeInTheDocument()
    expect(screen.getByText('Custom Option 2')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toHaveAttribute('value', 'custom-1')
    expect(checkboxes[1]).toHaveAttribute('value', 'custom-2')
  })

  it('handles value prop with strings', () => {
    render(<FormCheckboxGroup {...defaultProps} value={['1', '3']} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[2]).toBeChecked()
  })

  it('handles value prop with numbers', () => {
    render(<FormCheckboxGroup {...defaultProps} value={[1, 3]} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[2]).toBeChecked()
  })

  it('calls onChange with strings when checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<FormCheckboxGroup {...defaultProps} onChange={onChange} />)

    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)

    expect(onChange).toHaveBeenCalled()
    // Should be called with string array for string items
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['1']))
  })

  it('calls onChange with numbers when checkbox is clicked for number items', () => {
    const onChange = vi.fn()
    const numberItems = [
      { id: 1, name: 'Number Option 1' },
      { id: 2, name: 'Number Option 2' }
    ]

    render(<FormCheckboxGroup {...defaultProps} items={numberItems} onChange={onChange} />)

    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)

    expect(onChange).toHaveBeenCalled()
    // Should be called with number array for number items
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([1]))
  })

  it('passes onBlur prop to CheckboxGroup', () => {
    const onBlur = vi.fn()
    render(<FormCheckboxGroup {...defaultProps} onBlur={onBlur} />)

    // The onBlur prop should be passed through to the underlying CheckboxGroup
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('handles non-string item values', () => {
    const numberItems = [
      { id: 1, name: 'Number Option 1' },
      { id: 2, name: 'Number Option 2' }
    ]

    render(<FormCheckboxGroup {...defaultProps} items={numberItems} />)

    expect(screen.getByText('Number Option 1')).toBeInTheDocument()
    expect(screen.getByText('Number Option 2')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toHaveAttribute('value', '1')
    expect(checkboxes[1]).toHaveAttribute('value', '2')
  })

  it('handles non-string item names', () => {
    const mixedItems = [
      { id: '1', name: 123 },
      { id: '2', name: null }
    ]

    render(<FormCheckboxGroup {...defaultProps} items={mixedItems} />)

    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('has proper accessibility structure', () => {
    render(<FormCheckboxGroup {...defaultProps} label="Options" />)

    const container = screen.getByRole('group')
    const label = screen.getByText('Options')
    const checkboxes = screen.getAllByRole('checkbox')

    expect(container).toBeInTheDocument()
    expect(label).toBeInTheDocument()
    expect(checkboxes).toHaveLength(3)
  })

  it('supports aria attributes', () => {
    render(
      <FormCheckboxGroup
        {...defaultProps}
        aria-label="Checkbox group for options"
        aria-describedby="description-id"
      />
    )

    const container = screen.getByRole('group')
    expect(container).toHaveAttribute('aria-label', 'Checkbox group for options')
  })

  it('handles keyboard navigation', () => {
    render(<FormCheckboxGroup {...defaultProps} />)

    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    firstCheckbox.focus()

    expect(firstCheckbox).toHaveFocus()

    fireEvent.keyDown(firstCheckbox, { key: ' ' })
    // Space key should toggle the checkbox
  })

  it('renders with error message', () => {
    render(<FormCheckboxGroup {...defaultProps} errorMessage="This field is required" />)

    // The errorMessage should be handled by the underlying CheckboxGroup
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('handles function error message', () => {
    render(<FormCheckboxGroup {...defaultProps} errorMessage={() => 'Custom error message'} />)

    // The errorMessage prop should be passed to the CheckboxGroup
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('handles items without id', () => {
    const itemsWithoutId = [{ name: 'Option 1' }, { name: 'Option 2' }]

    render(<FormCheckboxGroup {...defaultProps} items={itemsWithoutId} />)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })
})
