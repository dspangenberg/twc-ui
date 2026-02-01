import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

// Import the form errors components
import { FormErrors, FormFieldError, getFormError } from '@/components/twc-ui/form-errors'

// Mock the icons
vi.mock('@hugeicons/core-free-icons', () => ({
  Sad01Icon: ({ className }: { className?: string }) => (
    <div data-testid="sad-01-icon" className={className}>
      MockSad01Icon
    </div>
  )
}))

// Mock the Alert component
vi.mock('@/components/twc-ui/alert', () => ({
  Alert: ({ children, className, icon: Icon, title, variant }: any) => (
    <div data-testid="alert" className={className} data-variant={variant}>
      {Icon && <Icon data-testid="alert-icon" />}
      {title && <div data-testid="alert-title">{title}</div>}
      <div data-testid="alert-content">{children}</div>
    </div>
  )
}))

// Mock the Field component
vi.mock('@/components/twc-ui/field', () => ({
  FieldError: ({ className, children, ...props }: any) => (
    <div data-testid="field-error" className={className} {...props}>
      {children}
    </div>
  )
}))

// Mock react-aria-components
vi.mock('react-aria-components', () => ({
  useLocale: () => ({ locale: 'en' }),
  FieldErrorProps: {}
}))

// Mock the form context
vi.mock('@/components/twc-ui/form', () => ({
  useFormContext: () => ({
    errorVariant: 'field'
  })
}))

describe('getFormError Utility Function', () => {
  describe('Error Retrieval', () => {
    it('returns undefined when errors is undefined', () => {
      const result = getFormError(undefined, 'name')
      expect(result).toBeUndefined()
    })

    it('returns undefined when name is undefined', () => {
      const errors = { name: 'Error message' }
      const result = getFormError(errors, undefined)
      expect(result).toBeUndefined()
    })

    it('returns undefined when both errors and name are undefined', () => {
      const result = getFormError(undefined, undefined)
      expect(result).toBeUndefined()
    })

    it('returns direct error when exact match exists', () => {
      const errors = { name: 'Name is required' }
      const result = getFormError(errors, 'name')
      expect(result).toBe('Name is required')
    })

    it('returns laravel-style array notation error', () => {
      const errors = { 'users.0': 'Name is required' }
      const result = getFormError(errors, 'users[0]')
      expect(result).toBe('Name is required')
    })

    it('returns laravel-style array notation error with nested arrays', () => {
      const errors = { 'users.0': 'Street is required' }
      const result = getFormError(errors, 'users[0]')
      expect(result).toBe('Street is required')
    })

    it('returns undefined when no matching error exists', () => {
      const errors = { name: 'Name is required' }
      const result = getFormError(errors, 'email')
      expect(result).toBeUndefined()
    })

    it('prioritizes direct error over laravel-style notation', () => {
      const errors = {
        'users[0]': 'Direct error',
        'users.0': 'Laravel style error'
      }
      const result = getFormError(errors, 'users[0]')
      expect(result).toBe('Direct error')
    })
  })
})

describe('FormErrors Component', () => {
  describe('Basic Rendering', () => {
    it('renders null when no errors are provided', () => {
      const { container } = render(<FormErrors errors={{}} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders null when errors is empty object', () => {
      const { container } = render(<FormErrors errors={{}} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders alert with errors when errors are provided', () => {
      const errors = { name: 'Name is required', email: 'Email is invalid' }
      render(<FormErrors errors={errors} />)

      const alert = screen.getByTestId('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('data-variant', 'destructive')
    })

    it('renders error messages in list format', () => {
      const errors = { name: 'Name is required', email: 'Email is invalid' }
      render(<FormErrors errors={errors} />)

      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is invalid')).toBeInTheDocument()
    })

    it('renders icon when errors are present', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} />)

      const icon = screen.getByTestId('sad-01-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('MockSad01Icon')
    })
  })

  describe('Title Handling', () => {
    it('uses default English title when locale is English', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} />)

      const title = screen.getByTestId('alert-title')
      expect(title).toHaveTextContent('Something went wrong')
    })

    it('uses custom title when provided', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} title="Custom Error Title" />)

      const title = screen.getByTestId('alert-title')
      expect(title).toHaveTextContent('Custom Error Title')
    })
  })

  describe('Error Display Control', () => {
    it('hides error list when showErrors is false', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} showErrors={false} />)

      const alert = screen.getByTestId('alert')
      expect(alert).toBeInTheDocument()

      // List items should not be present when showErrors is false
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    })

    it('shows error list when showErrors is true (default)', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} showErrors={true} />)

      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className to alert', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} className="custom-error-class" />)

      const alert = screen.getByTestId('alert')
      expect(alert).toHaveClass('custom-error-class')
    })

    it('preserves default variant classes with custom className', () => {
      const errors = { name: 'Name is required' }
      render(<FormErrors errors={errors} className="custom-class" />)

      const alert = screen.getByTestId('alert')
      expect(alert).toHaveClass('custom-class')
      expect(alert).toHaveAttribute('data-variant', 'destructive')
    })
  })

  describe('Error Message Processing', () => {
    it('handles empty string errors', () => {
      const errors = { name: '' }
      render(<FormErrors errors={errors} />)

      const listItems = screen.getAllByRole('listitem')
      expect(listItems[0]).toHaveTextContent('')
    })

    it('handles numeric error values as strings', () => {
      const errors = { count: '123' }
      render(<FormErrors errors={errors} />)

      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('handles boolean error values as strings', () => {
      const errors = { active: 'true' }
      render(<FormErrors errors={errors} />)

      expect(screen.getByText('true')).toBeInTheDocument()
    })

    it('preserves order of error messages', () => {
      const errors = {
        name: 'Name error',
        email: 'Email error',
        password: 'Password error'
      }
      render(<FormErrors errors={errors} />)

      expect(screen.getByText('Name error')).toBeInTheDocument()
      expect(screen.getByText('Email error')).toBeInTheDocument()
      expect(screen.getByText('Password error')).toBeInTheDocument()
    })
  })

  describe('Memoization', () => {
    it('recalculates error messages when errors change', () => {
      const initialErrors = { name: 'Name is required' }
      const { rerender } = render(<FormErrors errors={initialErrors} />)

      expect(screen.getByText('Name is required')).toBeInTheDocument()

      const updatedErrors = { email: 'Email is invalid' }
      rerender(<FormErrors errors={updatedErrors} />)

      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
      expect(screen.getByText('Email is invalid')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles null errors gracefully', () => {
      const { container } = render(<FormErrors errors={null as any} />)
      expect(container.firstChild).toBeNull()
    })

    it('handles undefined errors gracefully', () => {
      const { container } = render(<FormErrors errors={undefined as any} />)
      expect(container.firstChild).toBeNull()
    })

    it('handles errors with undefined values', () => {
      const errors = { name: 'Name error', email: undefined } as any
      render(<FormErrors errors={errors} />)

      expect(screen.getByText('Name error')).toBeInTheDocument()
    })
  })
})

describe('FormFieldError Component', () => {
  describe('Form Context Integration', () => {
    it('renders FieldError when errorVariant is not "form"', () => {
      render(<FormFieldError className="custom-field-error">Field error message</FormFieldError>)

      const fieldError = screen.getByTestId('field-error')
      expect(fieldError).toBeInTheDocument()
      expect(fieldError).toHaveClass('custom-field-error')
      expect(fieldError).toHaveClass('font-medium', 'text-destructive', 'text-sm')
    })
  })

  describe('Styling and Props', () => {
    it('applies default classes to FieldError', () => {
      render(<FormFieldError>Error message</FormFieldError>)

      const fieldError = screen.getByTestId('field-error')
      expect(fieldError).toHaveClass('font-medium', 'text-destructive', 'text-sm')
    })

    it('merges custom className with default classes', () => {
      render(<FormFieldError className="custom-class">Error message</FormFieldError>)

      const fieldError = screen.getByTestId('field-error')
      expect(fieldError).toHaveClass('font-medium', 'text-destructive', 'text-sm', 'custom-class')
    })

    it('passes additional props to FieldError', () => {
      render(<FormFieldError data-testid="custom-field-error">Error message</FormFieldError>)

      const fieldError = screen.getByTestId('custom-field-error')
      expect(fieldError).toBeInTheDocument()
      expect(fieldError).toHaveTextContent('Error message')
    })
  })
})

describe('Component Integration', () => {
  describe('FormErrors with Different Error Types', () => {
    it('handles mixed error types correctly', () => {
      const errors = {
        name: 'Name is required',
        count: '0',
        active: 'false',
        nested: 'Nested error'
      }
      render(<FormErrors errors={errors} />)

      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('false')).toBeInTheDocument()
      expect(screen.getByText('Nested error')).toBeInTheDocument()
    })
  })
})
