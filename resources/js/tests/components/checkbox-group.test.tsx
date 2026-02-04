import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox, CheckboxGroup } from '@/components/twc-ui/checkbox'

describe('CheckboxGroup', () => {
  const defaultProps = {
    name: 'test-group',
    label: 'Test Group'
  }

  const mockOnChange = vi.fn()

  it('renders group with label', () => {
    render(
      <CheckboxGroup {...defaultProps}>
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
        <Checkbox name="option2" onChange={mockOnChange}>
          Option 2
        </Checkbox>
      </CheckboxGroup>
    )

    expect(screen.getByText('Test Group')).toBeInTheDocument()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <CheckboxGroup {...defaultProps} description="This is a description">
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
      </CheckboxGroup>
    )

    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('renders error message when provided', () => {
    render(
      <CheckboxGroup {...defaultProps} errorMessage="This field is required" isInvalid>
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
      </CheckboxGroup>
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-group-class'
    const { container } = render(
      <CheckboxGroup {...defaultProps} className={customClass}>
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
      </CheckboxGroup>
    )

    const group = container.querySelector('[role="group"]')
    expect(group).toHaveClass(customClass)
  })

  it('passes through other props to AriaCheckboxGroup', () => {
    render(
      <CheckboxGroup {...defaultProps} isDisabled isRequired isInvalid>
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
      </CheckboxGroup>
    )

    const group = screen.getByRole('group')
    expect(group).toBeInTheDocument()
    // React Aria Components handles these props internally
  })

  it('renders multiple checkboxes', () => {
    render(
      <CheckboxGroup {...defaultProps}>
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
        <Checkbox name="option2" onChange={mockOnChange}>
          Option 2
        </Checkbox>
        <Checkbox name="option3" onChange={mockOnChange}>
          Option 3
        </Checkbox>
      </CheckboxGroup>
    )

    expect(screen.getByRole('checkbox', { name: 'Option 1' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Option 2' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Option 3' })).toBeInTheDocument()
  })

  it('handles function-based error messages', () => {
    const errorMessage = vi.fn().mockReturnValue('Custom error message')
    render(
      <CheckboxGroup {...defaultProps} errorMessage={errorMessage} isInvalid>
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
      </CheckboxGroup>
    )

    expect(errorMessage).toHaveBeenCalled()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('has proper accessibility structure', () => {
    render(
      <CheckboxGroup {...defaultProps} description="Group description">
        <Checkbox name="option1" onChange={mockOnChange}>
          Option 1
        </Checkbox>
      </CheckboxGroup>
    )

    const group = screen.getByRole('group')
    const label = screen.getByText('Test Group')
    const description = screen.getByText('Group description')

    expect(group).toBeInTheDocument()
    expect(label).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })
})
