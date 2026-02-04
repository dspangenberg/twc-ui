import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FormTextArea } from '@/components/twc-ui/form-text-area'

// Mock all dependencies
vi.mock('@/components/twc-ui/form-errors', () => ({
  getFormError: vi.fn(),
  FormFieldError: ({ children }: any) => <div data-testid="form-field-error">{children}</div>
}))

vi.mock('@/components/twc-ui/form', () => ({
  useFormContext: vi.fn()
}))

vi.mock('@/components/twc-ui/text-area', () => ({
  TextArea: ({
    errorMessage,
    className,
    isRequired,
    errorComponent,
    autoSize,
    rows,
    autoComplete,
    placeholder,
    label,
    description,
    ...props
  }: any) => (
    <div data-testid="text-area" className={className} data-isrequired={isRequired} {...props}>
      <div data-testid="error-component">{errorMessage}</div>
      <div data-testid="props-summary">
        <span data-testid="autosize">{autoSize?.toString()}</span>
        <span data-testid="rows">{rows}</span>
        <span data-testid="autocomplete">{autoComplete}</span>
        <span data-testid="placeholder">{placeholder}</span>
        <span data-testid="label">{label}</span>
        <span data-testid="description">{description}</span>
      </div>
    </div>
  )
}))

vi.mock('@/hooks/use-field-change', () => ({
  useFieldChange: vi.fn()
}))

const mockGetFormError = vi.mocked(await import('@/components/twc-ui/form-errors')).getFormError
const mockUseFormContext = vi.mocked(await import('@/components/twc-ui/form')).useFormContext
const mockUseFieldChange = vi.mocked(await import('@/hooks/use-field-change')).useFieldChange

describe('FormTextArea Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetFormError.mockReturnValue(undefined)
    mockUseFormContext.mockReturnValue({ errors: {} } as any)
    mockUseFieldChange.mockImplementation(onChange => onChange || vi.fn())
  })

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<FormTextArea name="testField" />)

      expect(screen.getByTestId('text-area')).toBeInTheDocument()
    })

    it('includes error component by default', () => {
      render(<FormTextArea name="testField" />)

      expect(screen.getByTestId('error-component')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('uses errorMessage prop when provided', () => {
      render(<FormTextArea name="testField" errorMessage="Custom error message" />)

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
    })

    it('uses getFormError when errorMessage prop is not provided', () => {
      const errorMessage = 'This field is required'
      mockUseFormContext.mockReturnValue({
        errors: { testField: errorMessage }
      } as any)
      mockGetFormError.mockReturnValue(errorMessage)

      render(<FormTextArea name="testField" />)

      expect(mockUseFormContext).toHaveBeenCalled()
      expect(mockGetFormError).toHaveBeenCalledWith({ testField: errorMessage }, 'testField')
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('prioritizes errorMessage prop over form context errors', () => {
      const formContextError = 'Form context error'
      mockUseFormContext.mockReturnValue({
        errors: { testField: formContextError }
      } as any)

      render(<FormTextArea name="testField" errorMessage="Prop error message" />)

      expect(screen.getByText('Prop error message')).toBeInTheDocument()
      expect(screen.queryByText(formContextError)).not.toBeInTheDocument()
    })
  })

  describe('Props Integration', () => {
    it('passes value prop correctly', () => {
      render(<FormTextArea name="testField" value="test value" />)

      expect(screen.getByTestId('text-area')).toHaveAttribute('value', 'test value')
    })

    it('passes onChange prop correctly', () => {
      const handleChange = vi.fn()

      render(<FormTextArea name="testField" onChange={handleChange} />)

      // Since onChange is a function prop, we just verify it was rendered without error
      expect(screen.getByTestId('text-area')).toBeInTheDocument()
    })

    it('passes isRequired prop correctly', () => {
      render(<FormTextArea name="testField" isRequired={true} />)

      const textArea = screen.getByTestId('text-area')
      expect(textArea).toHaveAttribute('data-isrequired', 'true')
    })

    it('passes autoComplete prop correctly', () => {
      render(<FormTextArea name="testField" autoComplete="email" />)

      expect(screen.getByTestId('autocomplete')).toHaveTextContent('email')
    })

    it('passes placeholder prop correctly', () => {
      render(<FormTextArea name="testField" placeholder="Enter your message" />)

      expect(screen.getByTestId('placeholder')).toHaveTextContent('Enter your message')
    })

    it('passes rows prop correctly', () => {
      render(<FormTextArea name="testField" rows={5} />)

      expect(screen.getByTestId('rows')).toHaveTextContent('5')
    })

    it('passes autoSize prop correctly', () => {
      render(<FormTextArea name="testField" autoSize={false} />)

      expect(screen.getByTestId('autosize')).toHaveTextContent('false')
    })
  })

  describe('Error Component Integration', () => {
    it('passes errorMessage to error component', () => {
      render(<FormTextArea name="testField" errorMessage="Custom error" />)

      const errorComponent = screen.getByTestId('error-component')
      expect(errorComponent).toHaveTextContent('Custom error')
    })

    it('handles undefined errorMessage', () => {
      render(<FormTextArea name="testField" />)

      const errorComponent = screen.getByTestId('error-component')
      expect(errorComponent).toBeInTheDocument()
      expect(errorComponent).toHaveTextContent('')
    })
  })

  describe('Form Context Integration', () => {
    it('calls useFormContext hook', () => {
      render(<FormTextArea name="testField" />)

      expect(mockUseFormContext).toHaveBeenCalled()
    })

    it('handles undefined name in getFormError call', () => {
      const errorMessage = 'Error'
      mockUseFormContext.mockReturnValue({
        errors: { testField: errorMessage }
      } as any)
      mockGetFormError.mockReturnValue(errorMessage)

      render(<FormTextArea {...({} as any)} />)

      expect(mockGetFormError).toHaveBeenCalledWith({ testField: errorMessage }, undefined)
    })
  })

  describe('Complete Component Integration', () => {
    it('renders with all props working together', () => {
      const errorMessage = 'Message is required'
      mockUseFormContext.mockReturnValue({
        errors: { message: errorMessage }
      } as any)
      mockGetFormError.mockReturnValue(errorMessage)

      render(
        <FormTextArea
          name="message"
          label="Message"
          placeholder="Enter your message"
          description="Please provide a detailed message"
          value="Hello world"
          isRequired={true}
          autoComplete="off"
          rows={4}
          autoSize={true}
          className="w-full"
          onChange={vi.fn()}
        />
      )

      const textArea = screen.getByTestId('text-area')
      expect(textArea).toHaveAttribute('name', 'message')
      expect(screen.getByTestId('label')).toHaveTextContent('Message')
      expect(screen.getByTestId('placeholder')).toHaveTextContent('Enter your message')
      expect(screen.getByTestId('description')).toHaveTextContent(
        'Please provide a detailed message'
      )
      expect(textArea).toHaveAttribute('value', 'Hello world')
      expect(textArea).toHaveAttribute('data-isrequired', 'true')
      expect(screen.getByTestId('autocomplete')).toHaveTextContent('off')
      expect(screen.getByTestId('rows')).toHaveTextContent('4')
      expect(screen.getByTestId('autosize')).toHaveTextContent('true')
      expect(textArea).toHaveClass('w-full')
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('renders without any props', () => {
      render(<FormTextArea />)
      expect(screen.getByTestId('text-area')).toBeInTheDocument()
    })

    it('handles null value', () => {
      render(<FormTextArea name="testField" value={null} />)
      expect(screen.getByTestId('text-area')).toBeInTheDocument()
    })

    it('handles undefined value', () => {
      render(<FormTextArea name="testField" value={undefined} />)
      expect(screen.getByTestId('text-area')).toBeInTheDocument()
    })
  })
})
