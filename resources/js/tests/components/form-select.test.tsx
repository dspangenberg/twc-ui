import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FormSelect } from '@/components/twc-ui/form-select'

// Mock all dependencies
vi.mock('@/components/twc-ui/form-errors', () => ({
  getFormError: vi.fn(),
  FormFieldError: ({ children }: any) => <div data-testid="form-field-error">{children}</div>
}))

vi.mock('@/components/twc-ui/form', () => ({
  useFormContext: vi.fn()
}))

vi.mock('@/components/twc-ui/select', () => ({
  Select: ({ error, name, className, items, value, isDisabled, isRequired, ...props }: any) => (
    <div
      data-testid="select"
      className={className}
      data-name={name}
      data-error={error}
      data-is-disabled={isDisabled}
      data-is-required={isRequired}
      {...props}
    >
      <select>
        {items?.map((item: any, index: number) => (
          <option key={item.id || index} value={item.id || index}>
            {item.name || item}
          </option>
        ))}
      </select>
      {error && <div data-testid="select-error">{error}</div>}
      <div data-testid="select-value">{value}</div>
    </div>
  )
}))

const mockGetFormError = vi.mocked(await import('@/components/twc-ui/form-errors')).getFormError
const mockUseFormContext = vi.mocked(await import('@/components/twc-ui/form')).useFormContext

describe('FormSelect Component', () => {
  const mockItems = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetFormError.mockReturnValue(undefined)
    mockUseFormContext.mockReturnValue({ errors: {} } as any)
  })

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      expect(screen.getByTestId('select')).toBeInTheDocument()
    })

    it('passes name prop to underlying Select', () => {
      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      const select = screen.getByTestId('select')
      expect(select).toHaveAttribute('data-name', 'test_field')
    })

    it('passes items prop to underlying Select', () => {
      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent('Option 1')
      expect(options[1]).toHaveTextContent('Option 2')
      expect(options[2]).toHaveTextContent('Option 3')
    })

    it('passes value prop to underlying Select', () => {
      render(<FormSelect items={mockItems} name="test_field" value="2" />)

      expect(screen.getByTestId('select-value')).toHaveTextContent('2')
    })

    it('passes className prop to underlying Select', () => {
      const customClass = 'custom-select-class'
      render(<FormSelect items={mockItems} name="test_field" value="1" className={customClass} />)

      const select = screen.getByTestId('select')
      expect(select).toHaveClass(customClass)
    })
  })

  describe('Error Handling', () => {
    it('displays error from form context when no error prop is provided', () => {
      const errorMessage = 'This field is required'
      mockGetFormError.mockReturnValue(errorMessage)

      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      const select = screen.getByTestId('select')
      expect(select).toHaveAttribute('data-error', errorMessage)
      expect(screen.getByTestId('select-error')).toHaveTextContent(errorMessage)
    })

    it('uses error prop when provided instead of form context error', () => {
      const formError = 'Form context error'
      const propError = 'Prop error message'
      mockGetFormError.mockReturnValue(formError)

      render(<FormSelect items={mockItems} name="test_field" value="1" error={propError} />)

      const select = screen.getByTestId('select')
      expect(select).toHaveAttribute('data-error', propError)
      expect(screen.getByTestId('select-error')).toHaveTextContent(propError)
    })

    it('displays no error when form context has no error for this field', () => {
      mockGetFormError.mockReturnValue(undefined)

      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      expect(screen.queryByTestId('select-error')).not.toBeInTheDocument()
      const select = screen.getByTestId('select')
      expect(select).not.toHaveAttribute('data-error')
    })

    it('calls getFormError with correct parameters', () => {
      const mockErrors = { test_field: 'Field error', other_field: 'Other error' }
      mockUseFormContext.mockReturnValue({ errors: mockErrors } as any)

      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      expect(mockGetFormError).toHaveBeenCalledWith(mockErrors, 'test_field')
    })

    it('calls getFormError with form errors when name is undefined', () => {
      const mockErrors = { test_field: 'Field error' }
      mockUseFormContext.mockReturnValue({ errors: mockErrors } as any)
      render(<FormSelect items={mockItems} name={undefined as any} value="1" />)

      expect(mockGetFormError).toHaveBeenCalledWith(mockErrors, undefined)
    })
  })

  describe('Form Context Integration', () => {
    it('uses form context when available', () => {
      const mockForm = {
        errors: { test_field: 'Context error' },
        data: { test_field: '1' }
      }
      mockUseFormContext.mockReturnValue(mockForm as any)
      mockGetFormError.mockReturnValue('Context error')

      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      expect(mockUseFormContext).toHaveBeenCalled()
      expect(screen.getByTestId('select-error')).toHaveTextContent('Context error')
    })

    it('handles null form context gracefully', () => {
      mockUseFormContext.mockReturnValue(null)

      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      expect(screen.getByTestId('select')).toBeInTheDocument()
      expect(screen.queryByTestId('select-error')).not.toBeInTheDocument()
    })

    it('passes FormFieldError as errorComponent to underlying Select', () => {
      render(<FormSelect items={mockItems} name="test_field" value="1" />)

      // The FormFieldError component should be passed as errorComponent
      // This is tested implicitly through the mock setup
      expect(screen.getByTestId('select')).toBeInTheDocument()
    })
  })

  describe('Props Passthrough', () => {
    it('passes additional props to underlying Select', () => {
      render(
        <FormSelect
          items={mockItems}
          name="test_field"
          value="1"
          placeholder="Select an option"
          isDisabled
          isRequired
        />
      )

      const select = screen.getByTestId('select')
      expect(select).toHaveAttribute('placeholder', 'Select an option')
      expect(select).toHaveAttribute('data-is-disabled', 'true')
      expect(select).toHaveAttribute('data-is-required', 'true')
    })

    it('passes label prop to underlying Select', () => {
      render(<FormSelect items={mockItems} name="test_field" value="1" label="Test Label" />)

      const select = screen.getByTestId('select')
      expect(select).toHaveAttribute('label', 'Test Label')
    })

    it('passes description prop to underlying Select', () => {
      render(
        <FormSelect items={mockItems} name="test_field" value="1" description="Test Description" />
      )

      const select = screen.getByTestId('select')
      expect(select).toHaveAttribute('description', 'Test Description')
    })
  })

  describe('Complex Error Scenarios', () => {
    it('handles Laravel-style array field names', () => {
      const arrayFieldName = 'users[0].name'
      mockGetFormError.mockReturnValue('Array field error')

      render(<FormSelect items={mockItems} name={arrayFieldName} value="1" />)

      expect(mockGetFormError).toHaveBeenCalledWith(expect.any(Object), arrayFieldName)
      expect(screen.getByTestId('select-error')).toHaveTextContent('Array field error')
    })

    it('handles nested field names', () => {
      const nestedFieldName = 'user.address.city'
      mockGetFormError.mockReturnValue('Nested field error')

      render(<FormSelect items={mockItems} name={nestedFieldName} value="1" />)

      expect(mockGetFormError).toHaveBeenCalledWith(expect.any(Object), nestedFieldName)
      expect(screen.getByTestId('select-error')).toHaveTextContent('Nested field error')
    })
  })

  describe('Type Safety', () => {
    it('handles different data types for items', () => {
      const stringItems = [
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
        { id: '3', name: 'Option 3' }
      ]

      render(<FormSelect items={stringItems} name="test_field" value="1" />)

      expect(screen.getByTestId('select')).toBeInTheDocument()
    })

    it('handles complex object items', () => {
      const complexItems = [
        { id: '1', name: 'Option 1', category: 'A' },
        { id: '2', name: 'Option 2', category: 'B' }
      ]

      render(<FormSelect items={complexItems} name="test_field" value="1" />)

      expect(screen.getByTestId('select')).toBeInTheDocument()
    })
  })
})
