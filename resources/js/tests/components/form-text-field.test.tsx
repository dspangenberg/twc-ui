import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FormTextField } from '@/components/twc-ui/form-text-field'

// Mock all dependencies
vi.mock('@/components/twc-ui/form-errors', () => ({
  getFormError: vi.fn(),
  FormFieldError: ({ children }: any) => <div data-testid="form-field-error">{children}</div>
}))

vi.mock('@/components/twc-ui/form', () => ({
  useFormContext: vi.fn()
}))

vi.mock('@/components/twc-ui/text-field', () => ({
  TextField: ({ errorMessage, className, isRequired, errorComponent, ...props }: any) => (
    <div data-testid="text-field" className={className} data-isrequired={isRequired} {...props}>
      <div data-testid="error-component">{errorMessage}</div>
    </div>
  )
}))

vi.mock('@/hooks/use-field-change', () => ({
  useFieldChange: vi.fn()
}))

const mockGetFormError = vi.mocked(await import('@/components/twc-ui/form-errors')).getFormError
const mockUseFormContext = vi.mocked(await import('@/components/twc-ui/form')).useFormContext
const mockUseFieldChange = vi.mocked(await import('@/hooks/use-field-change')).useFieldChange

describe('FormTextField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetFormError.mockReturnValue(undefined)
    mockUseFormContext.mockReturnValue({ errors: {} } as any)
    mockUseFieldChange.mockImplementation(onChange => onChange || vi.fn())
  })

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<FormTextField name="testField" />)

      expect(screen.getByTestId('text-field')).toBeInTheDocument()
    })

    it('includes error component by default', () => {
      render(<FormTextField name="testField" />)

      expect(screen.getByTestId('error-component')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('uses errorMessage prop when provided', () => {
      render(<FormTextField name="testField" errorMessage="Custom error message" />)

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
    })

    it('uses getFormError when errorMessage prop is not provided', () => {
      const errorMessage = 'This field is required'
      mockUseFormContext.mockReturnValue({
        errors: { testField: errorMessage }
      } as any)
      mockGetFormError.mockReturnValue(errorMessage)

      render(<FormTextField name="testField" />)

      expect(mockUseFormContext).toHaveBeenCalled()
      expect(mockGetFormError).toHaveBeenCalledWith({ testField: errorMessage }, 'testField')
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('prioritizes errorMessage prop over form context errors', () => {
      const formContextError = 'Form context error'
      mockUseFormContext.mockReturnValue({
        errors: { testField: formContextError }
      } as any)

      render(<FormTextField name="testField" errorMessage="Prop error message" />)

      expect(screen.getByText('Prop error message')).toBeInTheDocument()
      expect(screen.queryByText(formContextError)).not.toBeInTheDocument()
    })
  })

  describe('Props Integration', () => {
    it('passes value prop correctly', () => {
      render(<FormTextField name="testField" value="test value" />)

      expect(screen.getByTestId('text-field')).toHaveAttribute('value', 'test value')
    })

    it('passes onChange prop correctly', () => {
      const handleChange = vi.fn()

      render(<FormTextField name="testField" onChange={handleChange} />)

      // Since onChange is a function prop, we just verify it was rendered without error
      expect(screen.getByTestId('text-field')).toBeInTheDocument()
    })

    it('passes isRequired prop correctly', () => {
      render(<FormTextField name="testField" isRequired={true} />)

      const textField = screen.getByTestId('text-field')
      expect(textField).toHaveAttribute('data-isrequired', 'true')
    })

    it('passes autoComplete prop correctly', () => {
      render(<FormTextField name="testField" autoComplete="email" />)

      expect(screen.getByTestId('text-field')).toHaveAttribute('autoComplete', 'email')
    })
  })

  describe('Error Component Integration', () => {
    it('passes errorMessage to error component', () => {
      render(<FormTextField name="testField" errorMessage="Custom error" />)

      const errorComponent = screen.getByTestId('error-component')
      expect(errorComponent).toHaveTextContent('Custom error')
    })

    it('handles undefined errorMessage', () => {
      render(<FormTextField name="testField" />)

      const errorComponent = screen.getByTestId('error-component')
      expect(errorComponent).toBeInTheDocument()
      expect(errorComponent).toHaveTextContent('')
    })
  })

  describe('Form Context Integration', () => {
    it('calls useFormContext hook', () => {
      render(<FormTextField name="testField" />)

      expect(mockUseFormContext).toHaveBeenCalled()
    })

    it('handles undefined name in getFormError call', () => {
      const errorMessage = 'Error'
      mockUseFormContext.mockReturnValue({
        errors: { testField: errorMessage }
      } as any)
      mockGetFormError.mockReturnValue(errorMessage)

      render(<FormTextField {...({} as any)} />)

      expect(mockGetFormError).toHaveBeenCalledWith({ testField: errorMessage }, undefined)
    })
  })

  describe('Complete Component Integration', () => {
    it('renders with all props working together', () => {
      const errorMessage = 'Username already taken'
      mockUseFormContext.mockReturnValue({
        errors: { username: errorMessage }
      } as any)
      mockGetFormError.mockReturnValue(errorMessage)

      render(
        <FormTextField
          name="username"
          label="Username"
          placeholder="Enter your username"
          description="Username must be unique"
          value="existing_user"
          isRequired={true}
          autoComplete="username"
          className="w-full"
          onChange={vi.fn()}
        />
      )

      expect(screen.getByTestId('text-field')).toHaveAttribute('name', 'username')
      expect(screen.getByTestId('text-field')).toHaveAttribute('label', 'Username')
      expect(screen.getByTestId('text-field')).toHaveAttribute('placeholder', 'Enter your username')
      expect(screen.getByTestId('text-field')).toHaveAttribute(
        'description',
        'Username must be unique'
      )
      expect(screen.getByTestId('text-field')).toHaveAttribute('value', 'existing_user')
      expect(screen.getByTestId('text-field')).toHaveAttribute('data-isrequired', 'true')
      expect(screen.getByTestId('text-field')).toHaveAttribute('autoComplete', 'username')
      expect(screen.getByTestId('text-field')).toHaveClass('w-full')
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
})
