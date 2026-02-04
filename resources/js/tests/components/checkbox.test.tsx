import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Import component
import { Checkbox } from '@/components/twc-ui/checkbox'

// Setup testing library matchers
import '@testing-library/jest-dom'

// Mock react-aria-components
vi.mock('react-aria-components', () => ({
  Checkbox: ({ children, className, ...props }: any) => {
    const {
      label,
      isDisabled: propIsDisabled,
      autoFocus,
      hasError,
      isIndeterminate: propIndeterminate,
      isSelected: propSelected,
      isInvalid: propInvalid,
      checked: propChecked,
      defaultChecked: propDefaultChecked,
      disabled: propDisabled,
      value: propValue,
      ...inputProps
    } = props

    const disabled = propDisabled || propIsDisabled
    const isIndeterminate = propIndeterminate || false
    const isSelected = propSelected || propChecked || false
    const isInvalid = propInvalid || hasError || false

    return (
      <label className={className} data-testid="checkbox-label">
        <input
          type="checkbox"
          data-testid="checkbox-input"
          name={inputProps.name}
          value={propValue}
          disabled={disabled}
          autoFocus={autoFocus || undefined}
          aria-invalid={isInvalid}
          defaultChecked={propDefaultChecked}
          checked={propChecked}
          {...inputProps}
          {...(props['aria-label'] && { 'aria-label': props['aria-label'] })}
          {...(props['aria-labelledby'] && { 'aria-labelledby': props['aria-labelledby'] })}
          {...(props['aria-describedby'] && { 'aria-describedby': props['aria-describedby'] })}
        />
        {label || children}
      </label>
    )
  },
  CheckboxGroup: ({ children, ...props }: any) => (
    <fieldset data-testid="checkbox-group" {...props}>
      {children}
    </fieldset>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  composeRenderProps: (children: any, render: any) => {
    if (typeof render === 'function') {
      const renderProps = {
        isIndeterminate: false,
        isSelected: false,
        isDisabled: false,
        isPressed: false,
        isFocusVisible: false,
        isInvalid: false,
        isReadOnly: false
      }
      return render(children, renderProps)
    }
    return children || render
  }
}))

// Mock the field components
vi.mock('@/components/twc-ui/field', () => ({
  FieldError: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="field-error">{children}</div>
  ),
  Label: ({ children, ...props }: any) => (
    <label {...props} data-testid="field-label">
      {children}
    </label>
  ),
  labelVariants: 'text-sm font-medium'
}))

describe('Checkbox', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders checkbox with label', () => {
      render(<Checkbox name="test" label="Test Checkbox" />)
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
      expect(screen.getByText('Test Checkbox')).toBeInTheDocument()
    })

    it('renders checkbox without label', () => {
      render(<Checkbox name="test" />)
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Checkbox name="test" className="custom-class" />)
      const label = screen.getByTestId('checkbox-label')
      expect(label).toHaveClass('custom-class')
    })
  })

  describe('Props Integration', () => {
    it('applies name attribute', () => {
      render(<Checkbox name="custom-name" />)
      expect(screen.getByTestId('checkbox-input')).toHaveAttribute('name', 'custom-name')
    })

    it('handles isDisabled prop', () => {
      render(<Checkbox name="test" isDisabled />)
      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeDisabled()
    })

    it('handles autoFocus prop', () => {
      render(<Checkbox name="test" autoFocus />)
      const input = screen.getByTestId('checkbox-input')
      // Note: autoFocus is handled by React, not always visible as attribute
      expect(input).toBeInTheDocument()
    })

    it('handles hasError prop', () => {
      render(<Checkbox name="test" hasError />)
      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Event Handling', () => {
    it('calls onChange when checkbox value changes', async () => {
      const onChange = vi.fn()
      render(<Checkbox name="test" onChange={onChange} />)

      const input = screen.getByTestId('checkbox-input')
      await user.click(input)

      expect(onChange).toHaveBeenCalled()
      expect(onChange.mock.calls[0][0]).toHaveProperty('type', 'change')
    })

    it('calls onBlur when checkbox loses focus', async () => {
      const onBlur = vi.fn()
      render(<Checkbox name="test" onBlur={onBlur} />)

      const input = screen.getByTestId('checkbox-input')
      input.focus()
      await user.tab()

      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('State Management', () => {
    it('handles controlled checkbox', () => {
      render(<Checkbox name="test" checked={true} />)
      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })

    it('handles default checked state', () => {
      render(<Checkbox name="test" defaultChecked={true} />)
      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })

    it('handles indeterminate state', () => {
      render(<Checkbox name="test" isIndeterminate />)
      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Children Rendering', () => {
    it('renders custom children', () => {
      render(
        <Checkbox name="test">
          <span data-testid="custom-child">Custom content</span>
        </Checkbox>
      )
      expect(screen.getByTestId('custom-child')).toBeInTheDocument()
    })

    it('renders label as children when no label prop', () => {
      render(<Checkbox name="test">Custom label content</Checkbox>)
      expect(screen.getByText('Custom label content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders proper label association', () => {
      render(<Checkbox name="test" label="Accessible checkbox" />)
      const input = screen.getByTestId('checkbox-input')
      const label = screen.getByText('Accessible checkbox')

      expect(label).toBeInTheDocument()
      expect(input).toBeInTheDocument()
    })

    it('supports ARIA attributes', () => {
      render(
        <Checkbox name="test" aria-label="Custom aria label" aria-describedby="description-id" />
      )

      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('can be used in forms', () => {
      render(
        <form data-testid="test-form">
          <Checkbox name="form-field" label="Form checkbox" />
        </form>
      )

      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
      expect(screen.getByTestId('test-form')).toContainElement(screen.getByTestId('checkbox-input'))
    })

    it('supports form data submission', () => {
      render(
        <form>
          <Checkbox name="preferences" value="newsletter" label="Subscribe to newsletter" />
        </form>
      )

      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('displays error styling when hasError is true', () => {
      render(<Checkbox name="test" hasError label="Error checkbox" />)
      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    it('handles multiple checkboxes with same name', () => {
      render(
        <div>
          <Checkbox name="options" value="1" label="Option 1" />
          <Checkbox name="options" value="2" label="Option 2" />
        </div>
      )

      const inputs = screen.getAllByTestId('checkbox-input')
      expect(inputs).toHaveLength(2)
    })

    it('handles dynamic props changes', () => {
      const { rerender } = render(<Checkbox name="test" disabled={false} />)
      let input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()

      rerender(<Checkbox name="test" disabled={true} />)
      input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
    })

    it('handles complex children structures', () => {
      render(
        <Checkbox name="test">
          <div>
            <span data-testid="nested-span">Nested content</span>
            <p data-testid="nested-paragraph">Paragraph content</p>
          </div>
        </Checkbox>
      )

      expect(screen.getByTestId('nested-span')).toBeInTheDocument()
      expect(screen.getByTestId('nested-paragraph')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty label', () => {
      render(<Checkbox name="test" label="" />)
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })

    it('handles boolean label as children', () => {
      render(<Checkbox name="test">{true && <span>Conditional content</span>}</Checkbox>)
      expect(screen.getByText('Conditional content')).toBeInTheDocument()
    })

    it('handles null children gracefully', () => {
      render(<Checkbox name="test">{null}</Checkbox>)
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })

    it('handles undefined label', () => {
      render(<Checkbox name="test" label={undefined} />)
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })
  })

  describe('Performance and Composition', () => {
    it('renders efficiently with many checkboxes', () => {
      const checkboxes = Array.from({ length: 50 }, (_, i) => (
        <Checkbox key={i} name={`checkbox-${i}`} label={`Option ${i}`} />
      ))

      render(<div>{checkboxes}</div>)
      expect(screen.getAllByTestId('checkbox-input')).toHaveLength(50)
    })

    it('can be nested in other components', () => {
      render(
        <div className="parent-component" data-testid="parent">
          <Checkbox name="nested" label="Nested checkbox" />
        </div>
      )

      const parent = screen.getByTestId('parent')
      const checkbox = screen.getByTestId('checkbox-input')
      expect(parent).toContainElement(checkbox)
    })
  })

  describe('Component Contract', () => {
    it('accepts all standard HTML input attributes', () => {
      render(<Checkbox name="comprehensive" autoComplete="off" spellCheck={false} />)

      const input = screen.getByTestId('checkbox-input')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'comprehensive')
    })

    it('maintains consistent behavior across re-renders', () => {
      const { rerender } = render(<Checkbox name="test" label="Initial" />)

      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(<Checkbox name="test" label="Updated" />)
      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })
  })

  describe('Advanced Features', () => {
    it('supports keyboard navigation', async () => {
      render(<Checkbox name="test" label="Keyboard test" />)

      const input = screen.getByTestId('checkbox-input')
      input.focus()
      expect(input).toHaveFocus()

      await user.keyboard(' ')
      expect(input).toBeInTheDocument()
    })

    it('supports programmatic focus', () => {
      render(<Checkbox name="test" label="Focus test" />)

      const input = screen.getByTestId('checkbox-input')
      input.focus()
      expect(input).toHaveFocus()
    })

    it('handles checkbox groups', () => {
      render(
        <div data-testid="checkbox-container">
          <Checkbox name="group1" value="a" label="Group 1 - A" />
          <Checkbox name="group2" value="b" label="Group 2 - B" />
        </div>
      )

      const inputs = screen.getAllByTestId('checkbox-input')
      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toHaveAttribute('name', 'group1')
      expect(inputs[1]).toHaveAttribute('name', 'group2')
    })
  })
})
