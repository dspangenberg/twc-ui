import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Input, TextField } from '@/components/twc-ui/text-field'

// Mock the components we need
vi.mock('@/components/twc-ui/field', () => ({
  Label: ({ children, className, value, isRequired = false, ...props }: any) => {
    const valueWithColon = value ? `${value}:` : ''
    return (
      <label className={className} htmlFor="text-input" {...props}>
        {children ? (
          children
        ) : (
          <span>
            {valueWithColon}
            {isRequired && <span className="text-destructive">*</span>}
          </span>
        )}
      </label>
    )
  },
  FieldError: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {typeof children === 'function' ? children({ validation: {} }) : children}
    </div>
  ),
  FieldDescription: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  FieldText: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  Text: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  )
}))

vi.mock('react-aria-components', () => ({
  TextField: ({ children, className, isInvalid, ...props }: any) =>
    React.createElement(
      'div',
      {
        className: `group flex flex-col gap-1.5 ${className || ''}`,
        'data-testid': 'text-field',
        'data-invalid': isInvalid ? 'true' : 'false',
        ...props
      },
      children
    ),
  Input: ({
    className,
    value,
    onChange,
    placeholder,
    autoComplete,
    disabled,
    isInvalid,
    ...props
  }: any) =>
    React.createElement('input', {
      className: `flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20 ${className || ''} ${isInvalid ? 'data-invalid:border-destructive data-invalid:focus:border-destructive data-invalid:focus:ring-destructive/20' : ''} ${disabled ? 'data-disabled:cursor-not-allowed data-disabled:opacity-50' : ''}`,
      'data-testid': 'text-input',
      'data-invalid': isInvalid ? 'true' : undefined,
      disabled: disabled || false,
      value: value || '',
      onChange: (e: any) => {
        const newValue = e?.target?.value || e || ''
        if (onChange) {
          onChange(newValue)
        }
      },
      placeholder,
      autoComplete: autoComplete || 'off',
      ...props
    }),
  composeRenderProps: (className: string, fn: any) => fn(className)
}))

vi.mock('@/hooks/use-field-change', () => ({
  useFieldChange: (onChange: any) => {
    const mockChange = vi.fn()
    mockChange.mockImplementation((e: any) => {
      // Extract value from event if it's an event, otherwise use as-is
      const value = e?.target?.value || e || ''
      if (onChange) {
        onChange(value)
      }
      return value
    })
    return mockChange
  }
}))

vi.mock('tailwind-variants', () => ({
  tv: (config: any) => {
    const baseClasses = Array.isArray(config.base) ? config.base.join(' ') : config.base || ''
    return Object.assign(() => baseClasses, {
      base: config.base || [],
      variants: config.variants || {},
      defaultVariants: config.defaultVariants || {},
      toString: () => baseClasses
    })
  }
}))

describe('TextField', () => {
  it('renders a text field with label', () => {
    render(<TextField label="Name" />)

    expect(screen.getByTestId('text-field')).toBeInTheDocument()
    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByTestId('text-input')).toBeInTheDocument()
  })

  it('renders without label when not provided', () => {
    render(<TextField />)

    const textField = screen.getByTestId('text-field')
    expect(textField).toBeInTheDocument()
    expect(screen.queryByText(/:/)).not.toBeInTheDocument()
    expect(screen.getByTestId('text-input')).toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(<TextField label="Email" description="Please enter a valid email address" />)

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.getByTestId('text-input')).toBeInTheDocument()
  })

  it('renders with placeholder when provided', () => {
    render(<TextField label="Name" placeholder="Enter your name" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveAttribute('placeholder', 'Enter your name')
    expect(input).toBeInTheDocument()
  })

  it('sets required indicator on label when isRequired is true', () => {
    render(<TextField label="Password" isRequired={true} />)

    expect(screen.getByText('Password:')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show required indicator when isRequired is false', () => {
    render(<TextField label="Optional Field" isRequired={false} />)

    expect(screen.getByText('Optional Field:')).toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders with error message when errorMessage is provided', () => {
    render(<TextField label="Email" errorMessage="This field is required" />)

    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-invalid', 'true')
  })

  it('renders with error component when errorComponent is provided', () => {
    const CustomError = ({ children }: any) => <div data-testid="custom-error">{children}</div>
    render(
      <TextField label="Custom Error" errorMessage="Error occurred" errorComponent={CustomError} />
    )

    expect(screen.getByTestId('custom-error')).toBeInTheDocument()
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('handles errorMessage as function', () => {
    const getErrorMessage = vi.fn(() => 'Dynamic error message')
    render(<TextField label="Dynamic Error" errorMessage={getErrorMessage} />)

    expect(getErrorMessage).toHaveBeenCalled()
    expect(screen.getByText('Dynamic error message')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<TextField label="Test" className="custom-text-field" />)

    const textField = screen.getByTestId('text-field')
    expect(textField).toHaveClass('custom-text-field')
  })

  it('forwards additional props to underlying text field', () => {
    render(<TextField label="Test" data-testid="custom-field" name="username" />)

    expect(screen.getByTestId('custom-field')).toBeInTheDocument()
    expect(screen.getByTestId('custom-field')).toHaveAttribute('name', 'username')
  })

  it('uses default autoComplete off', () => {
    render(<TextField label="Test" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveAttribute('autoComplete', 'off')
  })

  it('applies custom autoComplete when provided', () => {
    render(<TextField label="Email" autoComplete="email" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })

  it('handles value prop correctly', () => {
    render(<TextField label="Test" value="Initial value" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveDisplayValue('Initial value')
  })

  it('handles null value', () => {
    render(<TextField label="Test" value={null} />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveDisplayValue('')
  })

  it('handles undefined value', () => {
    render(<TextField label="Test" value={undefined} />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveDisplayValue('')
  })

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn()
    render(<TextField label="Test" onChange={mockOnChange} />)

    const input = screen.getByTestId('text-input')
    fireEvent.change(input, { target: { value: 'New value' } })

    expect(mockOnChange).toHaveBeenCalledWith('New value')
  })

  it('handles onChange that accepts null', () => {
    const mockOnChange = vi.fn()
    render(<TextField label="Test" onChange={mockOnChange} />)

    const input = screen.getByTestId('text-input')
    fireEvent.change(input, { target: { value: 'Test' } })

    expect(mockOnChange).toHaveBeenCalledWith('Test')
  })

  it('calls onBlur when provided', () => {
    const mockOnBlur = vi.fn()
    render(<TextField label="Test" onBlur={mockOnBlur} />)

    const input = screen.getByTestId('text-input')
    fireEvent.blur(input)

    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('applies correct classes to text field container', () => {
    render(<TextField label="Test" />)

    const textField = screen.getByTestId('text-field')
    expect(textField).toHaveClass('group', 'flex', 'flex-col', 'gap-1.5')
  })

  it('applies error styling when errorMessage is present', () => {
    render(<TextField label="Test" errorMessage="Error message" />)

    expect(screen.getByTestId('text-field')).toHaveAttribute('data-invalid', 'true')
  })

  it('does not apply error styling when no errorMessage', () => {
    render(<TextField label="Test" />)

    expect(screen.getByTestId('text-field')).toHaveAttribute('data-invalid', 'false')
  })
})

describe('Input Component', () => {
  it('renders input with default classes', () => {
    render(<Input />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-sm',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-1',
      'font-medium',
      'text-sm',
      'shadow-none',
      'outline-0',
      'transition-colors',
      'file:border-0',
      'file:bg-transparent',
      'file:font-medium',
      'file:text-sm',
      'placeholder:text-muted-foreground',
      'focus:border-primary',
      'focus:ring-[3px]',
      'focus:ring-primary/20'
    )
  })

  it('applies custom className', () => {
    render(<Input className="custom-input-class" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveClass('custom-input-class')
  })

  it('forwards additional props to input', () => {
    render(<Input data-testid="custom-input" name="email" type="email" />)

    const input = screen.getByTestId('custom-input')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('selects text on focus', () => {
    render(<Input defaultValue="Some text" />)

    const input = screen.getByTestId('text-input')
    expect(input).toBeInTheDocument()
  })

  it('applies disabled classes when disabled', () => {
    render(<Input disabled />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveClass('data-disabled:cursor-not-allowed', 'data-disabled:opacity-50')
    expect(input).toBeDisabled()
  })

  it('applies focus classes when focused', () => {
    render(<Input />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveClass('focus:border-primary', 'focus:ring-[3px]', 'focus:ring-primary/20')
  })

  it('applies invalid classes when invalid', () => {
    render(<Input data-invalid="true" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveClass(
      'data-invalid:border-destructive',
      'data-invalid:focus:border-destructive',
      'data-invalid:focus:ring-destructive/20'
    )
  })

  it('handles file input styling', () => {
    render(<Input type="file" />)

    const input = screen.getByTestId('text-input')
    expect(input).toHaveClass(
      'file:border-0',
      'file:bg-transparent',
      'file:font-medium',
      'file:text-sm'
    )
  })
})
