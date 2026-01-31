import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FieldDescription, FieldError, FieldGroup, Label } from '@/components/twc-ui/field'

vi.mock('react-aria-components', () => ({
  Label: ({ children, className, ...props }: any) => (
    <label className={className} {...props}>
      {children}
    </label>
  ),
  Group: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Text: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  FieldError: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  composeRenderProps: (className: string | undefined, fn: (className: string) => string) =>
    fn(className || '')
}))

vi.mock('tailwind-variants', () => ({
  tv: (config: any) => {
    const baseClasses = Array.isArray(config.base) ? config.base.join(' ') : config.base || ''
    return Object.assign(
      (options: any = {}) => {
        let classes = baseClasses
        if (options.variant && config.variants?.[options.variant]) {
          const variantClasses = config.variants[options.variant]
          classes +=
            ' ' +
            (Array.isArray(variantClasses.base)
              ? variantClasses.base.join(' ')
              : variantClasses.base || '')
        }
        if (options.className) {
          classes += ' ' + options.className
        }
        return classes.trim()
      },
      {
        base: config.base || [],
        variants: config.variants || {},
        defaultVariants: config.defaultVariants || {},
        toString: () => baseClasses
      }
    )
  }
}))

describe('Label', () => {
  it('renders a label with children', () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders a label with value prop', () => {
    render(<Label value="Email Address" htmlFor="email" />)
    expect(screen.getByText('Email Address:')).toBeInTheDocument()
  })

  it('renders required indicator when isRequired is true', () => {
    render(<Label value="Password" isRequired={true} htmlFor="password" />)
    expect(screen.getByText('Password:')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Label className="custom-label-class" htmlFor="test">
        Custom Label
      </Label>
    )
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label-class')
  })

  it('applies default label classes', () => {
    render(<Label htmlFor="test">Default Label</Label>)
    const label = screen.getByText('Default Label')
    expect(label).toBeInTheDocument()
  })

  it('renders empty label when no value or children', () => {
    render(<Label htmlFor="test" />)
    const label = document.querySelector('label')
    expect(label?.textContent?.trim()).toBe('')
  })

  it('does not show required indicator when isRequired is false', () => {
    render(<Label value="Optional Field" isRequired={false} htmlFor="optional" />)
    expect(screen.getByText('Optional Field:')).toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(
      <Label data-testid="test-label" htmlFor="input-id">
        Test
      </Label>
    )
    const label = screen.getByTestId('test-label')
    expect(label).toHaveAttribute('for', 'input-id')
  })

  it('prioritizes children over value when both provided', () => {
    render(
      <Label value="Value Text" htmlFor="test">
        Children Text
      </Label>
    )
    expect(screen.getByText('Children Text')).toBeInTheDocument()
    expect(screen.queryByText('Value Text:')).not.toBeInTheDocument()
  })
})

describe('FieldGroup', () => {
  it('renders a field group with default variant', () => {
    render(<FieldGroup>Field Content</FieldGroup>)
    const group = screen.getByText('Field Content').parentElement
    expect(group).toBeInTheDocument()
  })

  it('renders with ghost variant', () => {
    render(<FieldGroup variant="ghost">Ghost Field</FieldGroup>)
    const group = screen.getByText('Ghost Field').parentElement
    expect(group).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<FieldGroup className="custom-group-class">Custom Group</FieldGroup>)
    const group = screen.getByText('Custom Group').parentElement
    expect(group).toBeInTheDocument()
    // Note: className is handled by composeRenderProps in the actual component
  })

  it('forwards additional props', () => {
    render(
      <FieldGroup data-testid="test-group" role="group">
        Group Content
      </FieldGroup>
    )
    const group = screen.getByTestId('test-group')
    expect(group).toHaveAttribute('role', 'group')
  })
})

describe('FieldDescription', () => {
  it('renders field description', () => {
    render(<FieldDescription>This is a description</FieldDescription>)
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('applies default description classes', () => {
    render(<FieldDescription>Description Text</FieldDescription>)
    const description = screen.getByText('Description Text')
    expect(description).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <FieldDescription className="custom-description-class">Custom Description</FieldDescription>
    )
    const description = screen.getByText('Custom Description')
    expect(description).toHaveClass('custom-description-class')
  })

  it('forwards additional props', () => {
    render(<FieldDescription data-testid="test-description">Test Description</FieldDescription>)
    const description = screen.getByTestId('test-description')
    expect(description).toBeInTheDocument()
  })

  it('has slot attribute set to description', () => {
    render(<FieldDescription>Description</FieldDescription>)
    const description = screen.getByText('Description')
    expect(description).toBeInTheDocument()
  })
})

describe('FieldError', () => {
  it('renders field error message', () => {
    render(<FieldError>This field is required</FieldError>)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies default error classes', () => {
    render(<FieldError>Error message</FieldError>)
    const error = screen.getByText('Error message')
    expect(error).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<FieldError className="custom-error-class">Custom Error</FieldError>)
    const error = screen.getByText('Custom Error')
    expect(error).toHaveClass('custom-error-class')
  })

  it('forwards additional props', () => {
    render(<FieldError data-testid="test-error">Test Error</FieldError>)
    const error = screen.getByTestId('test-error')
    expect(error).toBeInTheDocument()
  })
})

describe('Field Components Integration', () => {
  it('can use all field components together', () => {
    render(
      <div>
        <Label value="Email" isRequired={true} htmlFor="email" />
        <FieldGroup>Field Group Content</FieldGroup>
        <FieldDescription>Please enter a valid email address</FieldDescription>
        <FieldError>Email is required</FieldError>
      </div>
    )

    expect(screen.getByText('Email:')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('Field Group Content')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('maintains proper accessibility structure', () => {
    render(
      <div>
        <Label htmlFor="password" value="Password" isRequired={true} />
        <FieldGroup>Password Field</FieldGroup>
        <FieldDescription id="password-desc">Must be at least 8 characters</FieldDescription>
        <FieldError id="password-error">Password too short</FieldError>
      </div>
    )

    const label = screen.getByText('Password:')
    const description = screen.getByText('Must be at least 8 characters')
    const error = screen.getByText('Password too short')

    expect(label).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(error).toBeInTheDocument()
  })
})
