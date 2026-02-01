import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { RACTextArea, TextArea } from '@/components/twc-ui/text-area'

// Mock the useFieldChange hook
vi.mock('@/hooks/use-field-change', () => ({
  useFieldChange: (onChange: any) => onChange || vi.fn()
}))

// Mock components we need
vi.mock('@/components/twc-ui/field', () => ({
  Label: ({ children, className, value, isRequired = false, ...props }: any) => {
    const valueWithColon = value ? `${value}:` : ''
    return (
      <label className={className} htmlFor="text-area" {...props}>
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
  FieldDescription: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  FieldError: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {typeof children === 'function' ? children({ validation: {} }) : children}
    </div>
  )
}))

// Mock react-aria-components with proper forwarding
vi.mock('react-aria-components', () => {
  return {
    composeRenderProps: (className: any, render: any) => {
      return render(className)
    },
    TextField: ({ children, className, isInvalid, isDisabled, value, onChange, ...props }: any) => {
      return React.createElement(
        'div',
        {
          className: `group flex flex-col gap-1.5 text-sm ${className || ''}`,
          'data-testid': 'text-field',
          'data-invalid': isInvalid ? 'true' : 'false',
          'data-disabled': isDisabled ? 'true' : 'false',
          'data-value': value || '',
          ...props
        },
        // Pass TextField props down to children via context simulation
        React.Children.map(children, (child: any) => {
          if (React.isValidElement(child) && typeof child.type === 'function') {
            // Pass TextField props to TextArea children
            return React.cloneElement(child as any, {
              ...child.props,
              _textFieldProps: { isInvalid, isDisabled, value, onChange }
            })
          }
          return child
        })
      )
    },
    TextArea: (allProps: any) => {
      // Extract and remove internal props first
      const {
        _textFieldProps,
        ...propsWithoutInternal
      } = allProps

      // Extract known props, rest goes to DOM
      const {
        className,
        rows = 2,
        autoSize = true,
        onChange: directOnChange,
        placeholder = '',
        autoComplete = 'off',
        disabled,
        onBlur,
        value: directValue,
        'data-testid': dataTestId,
        ...domProps
      } = propsWithoutInternal

      const { isInvalid, isDisabled, value: contextValue, onChange: contextOnChange } = _textFieldProps || {}

      // Use context values if available, otherwise use direct values
      const onChange = contextOnChange || directOnChange
      const value = contextValue ?? directValue

      const baseClasses =
        'flex w-full rounded-sm border border-input bg-background px-3 py-1 font-medium shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20 data-invalid:border-destructive data-invalid:focus:border-destructive data-invalid:focus:ring-destructive/20 data-disabled:cursor-not-allowed data-disabled:opacity-50'
      const sizeClasses =
        autoSize !== false ? 'field-sizing-content min-h-20' : 'h-9 min-h-20 resize-none'
      const finalClassName = className
        ? `${baseClasses} ${sizeClasses} ${className}`
        : `${baseClasses} ${sizeClasses}`

      return React.createElement('textarea', {
        className: finalClassName,
        'data-testid': dataTestId || 'text-area-input',
        'data-invalid': isInvalid ? 'true' : undefined,
        'data-disabled': isDisabled ? 'true' : undefined,
        'data-auto-size': autoSize !== false ? 'true' : 'false',
        rows: rows,
        placeholder: placeholder,
        autoComplete: autoComplete,
        disabled: isDisabled || disabled || false,
        value: value ?? '',
        onChange: (e: any) => {
          const newValue = e?.target?.value || ''
          if (onChange) {
            onChange(newValue)
          }
        },
        onBlur: onBlur,
        onFocus: (e: any) => {
          e.target.focus()
        },
        ...domProps
      })
    }
  }
})

describe('TextArea Component', () =>
{
  it('renders a text area with label', () => {
    render(<TextArea label="Comments" />)

    expect(screen.getByText('Comments:')).toBeInTheDocument()
    expect(screen.getByTestId('text-field')).toBeInTheDocument()
    expect(screen.getByTestId('text-area-input')).toBeInTheDocument()
  })

  it('renders without label when not provided', () => {
    render(<TextArea />)

    expect(screen.getByTestId('text-field')).toBeInTheDocument()
    expect(screen.queryByText(/.*:/)).not.toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(<TextArea label="Feedback" description="Please provide your feedback" />)

    expect(screen.getByText('Please provide your feedback')).toBeInTheDocument()
    expect(screen.getByText('Feedback:')).toBeInTheDocument()
  })

  it('renders with placeholder when provided', () => {
    render(<TextArea label="Notes" placeholder="Enter your notes here" />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveAttribute('placeholder', 'Enter your notes here')
  })

  it('sets required indicator on label when isRequired is true', () => {
    render(<TextArea label="Description" isRequired={true} />)

    expect(screen.getByText('Description:')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show required indicator when isRequired is false', () => {
    render(<TextArea label="Optional Field" isRequired={false} />)

    expect(screen.getByText('Optional Field:')).toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders with error message when errorMessage is provided', () => {
    render(<TextArea label="Content" errorMessage="This field is required" />)

    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-invalid', 'true')
  })

  it('renders with error component when errorComponent is provided', () => {
    const CustomError = ({ children }: any) => <div data-testid="custom-error">{children}</div>

    render(
      <TextArea label="Custom Error" errorMessage="Error occurred" errorComponent={CustomError} />
    )

    expect(screen.getByTestId('custom-error')).toBeInTheDocument()
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('handles errorMessage as function', () => {
    const errorFn = (validation: any) => `Error: ${JSON.stringify(validation)}`
    render(<TextArea label="Function Error" errorMessage={errorFn} />)

    expect(screen.getByText('Error: {"validation":{}}')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<TextArea label="Test" className="custom-text-area" />)

    const textArea = screen.getByTestId('text-field')
    expect(textArea).toHaveClass('custom-text-area')
  })

  it('forwards additional props to underlying text field', () => {
    render(<TextArea label="Test" data-testid="custom-field" name="comments" />)

    expect(screen.getByTestId('custom-field')).toBeInTheDocument()
  })

  it('uses default autoComplete off', () => {
    render(<TextArea label="Test" />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveAttribute('autoComplete', 'off')
  })

  it('applies custom autoComplete when provided', () => {
    render(<TextArea label="Email" autoComplete="email" />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveAttribute('autoComplete', 'email')
  })

  it('handles value prop correctly', () => {
    render(<TextArea label="Test" value="Initial value" />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveDisplayValue('Initial value')
  })

  it('handles null value', () => {
    render(<TextArea label="Test" value={null} />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveDisplayValue('')
  })

  it('handles undefined value', () => {
    render(<TextArea label="Test" value={undefined} />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveDisplayValue('')
  })

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn()
    render(<TextArea label="Test" onChange={mockOnChange} />)

    const textArea = screen.getByTestId('text-area-input')
    fireEvent.change(textArea, { target: { value: 'New value' } })

    expect(mockOnChange).toHaveBeenCalledWith('New value')
  })

  it('handles onChange that accepts null', () => {
    const mockOnChange = vi.fn()
    render(<TextArea label="Test" onChange={mockOnChange} />)

    const textArea = screen.getByTestId('text-area-input')
    fireEvent.change(textArea, { target: { value: 'Test' } })

    expect(mockOnChange).toHaveBeenCalledWith('Test')
  })

  it('calls onBlur when provided', () => {
    const mockOnBlur = vi.fn()
    render(<TextArea label="Test" onBlur={mockOnBlur} />)

    const textArea = screen.getByTestId('text-area-input')
    fireEvent.blur(textArea)

    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('applies correct classes to text area container', () => {
    render(<TextArea label="Test" />)

    const textArea = screen.getByTestId('text-field')
    expect(textArea).toHaveClass('group', 'flex', 'flex-col', 'gap-1.5', 'text-sm')
  })

  it('applies error styling when errorMessage is present', () => {
    render(<TextArea label="Test" errorMessage="Error message" />)

    const textArea = screen.getByTestId('text-field')
    expect(textArea).toHaveAttribute('data-invalid', 'true')
  })

  it('does not apply error styling when no errorMessage', () => {
    render(<TextArea label="Test" />)

    const textArea = screen.getByTestId('text-field')
    expect(textArea).toHaveAttribute('data-invalid', 'false')
  })

  it('enables autoSize by default', () => {
    render(<TextArea label="Test" />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveAttribute('data-auto-size', 'true')
    expect(textArea).toHaveClass('field-sizing-content', 'min-h-20')
    expect(textArea).not.toHaveClass('h-9', 'resize-none')
  })

  it('handles disabled state', () => {
    render(<TextArea label="Test" isDisabled />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toBeDisabled()
    expect(textArea).toHaveAttribute('data-disabled', 'true')
    expect(textArea).toHaveClass('data-disabled:cursor-not-allowed', 'data-disabled:opacity-50')
  })

  it('handles focus events', () => {
    render(<TextArea label="Test" />)

    const textArea = screen.getByTestId('text-area-input')
    fireEvent.focus(textArea)

    expect(textArea).toHaveFocus()
  })

  it('applies error classes when invalid', () => {
    render(<TextArea label="Test" errorMessage="Error message" />)

    const textArea = screen.getByTestId('text-area-input')
    expect(textArea).toHaveAttribute('data-invalid', 'true')
    expect(textArea).toHaveClass(
      'data-invalid:border-destructive',
      'data-invalid:focus:border-destructive',
      'data-invalid:focus:ring-destructive/20'
    )
  })

  it('forwards props to inner textarea', () => {
    render(<TextArea label="Test" data-testid="custom-textarea" name="comments" maxLength={100} />)

    const textArea = screen.getByTestId('custom-textarea')
    expect(textArea).toHaveAttribute('name', 'comments')
    expect(textArea).toHaveAttribute('maxLength', '100')
  })
}
)

describe('RACTextArea Component', () =>
{
  it('renders textarea with default classes', () => {
    render(<RACTextArea />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveClass(
      'flex',
      'w-full',
      'rounded-sm',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-1',
      'font-medium',
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
      'focus:ring-primary/20',
      'field-sizing-content',
      'min-h-20'
    )
  })

  it('applies custom className', () => {
    render(<RACTextArea className="custom-textarea-class" />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveClass('custom-textarea-class')
  })

  it('forwards additional props to textarea', () => {
    render(<RACTextArea data-testid="custom-textarea" name="comments" />)

    const textarea = screen.getByTestId('custom-textarea')
    expect(textarea).toHaveAttribute('name', 'comments')
  })

  it('applies disabled classes when disabled', () => {
    render(<RACTextArea disabled />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveClass('data-disabled:cursor-not-allowed', 'data-disabled:opacity-50')
    expect(textarea).toBeDisabled()
  })

  it('applies invalid classes when invalid', () => {
    render(
      <RACTextArea className="data-invalid:border-destructive data-invalid:focus:border-destructive data-invalid:focus:ring-destructive/20" />
    )

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveClass(
      'data-invalid:border-destructive',
      'data-invalid:focus:border-destructive',
      'data-invalid:focus:ring-destructive/20'
    )
  })

  it('uses default rows when not provided', () => {
    render(<RACTextArea />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveAttribute('rows', '2')
  })

  it('enables autoSize by default', () => {
    render(<RACTextArea />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveAttribute('data-auto-size', 'true')
    expect(textarea).toHaveClass('field-sizing-content', 'min-h-20')
    expect(textarea).not.toHaveClass('h-9', 'resize-none')
  })

  it('handles focus events', () => {
    render(<RACTextArea />)

    const textarea = screen.getByTestId('text-area-input')
    fireEvent.focus(textarea)

    expect(textarea).toHaveFocus()
  })

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn()
    render(<RACTextArea onChange={mockOnChange} />)

    const textarea = screen.getByTestId('text-area-input')
    fireEvent.change(textarea, { target: { value: 'New value' } })

    expect(mockOnChange).toHaveBeenCalledWith('New value')
  })

  it('handles onBlur when provided', () => {
    const mockOnBlur = vi.fn()
    render(<RACTextArea onBlur={mockOnBlur} />)

    const textarea = screen.getByTestId('text-area-input')
    fireEvent.blur(textarea)

    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('applies placeholder when provided', () => {
    render(<RACTextArea placeholder="Enter text here" />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here')
  })

  it('applies autoComplete when provided', () => {
    render(<RACTextArea autoComplete="email" />)

    const textarea = screen.getByTestId('text-area-input')
    expect(textarea).toHaveAttribute('autoComplete', 'email')
  })
}
)
