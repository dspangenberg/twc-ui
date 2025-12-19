'use client'

import type { DateValue } from '@internationalized/date'
import type { VariantProps } from 'class-variance-authority'
import type React from 'react'
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { useFormContext } from '@/components/twc-ui/form'
import { useDateConversion } from '@/hooks/use-date-conversion'
import { cn } from '@/lib/utils'
import { FieldError, FormFieldError, fieldGroupVariants, Label } from './field'

const BaseDateField = AriaDateField

const DateSegment = ({ className, ...props }: AriaDateSegmentProps) => (
  <AriaDateSegment
    className={composeRenderProps(className, className =>
      cn(
        'inline rounded p-0.5 type-literal:px-0 caret-transparent outline-0',
        /* Placeholder */
        'data-placeholder:text-muted-foreground',
        /* Disabled */
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        /* Focused */
        'data-focused:bg-accent data-focused:text-accent-foreground',
        className
      )
    )}
    {...props}
  />
)

interface DateInputProps extends AriaDateInputProps, VariantProps<typeof fieldGroupVariants> {
  isInvalid?: boolean
}

const DateInput = ({
  className,
  isInvalid,
  variant,
  ...props
}: Omit<DateInputProps, 'children'>) => (
  <AriaDateInput
    className={composeRenderProps(className, className =>
      cn(fieldGroupVariants({ variant }), 'text-sm', className)
    )}
    {...props}
  >
    {segment => <DateSegment segment={segment} />}
  </AriaDateInput>
)

interface DateFieldProps extends Omit<AriaDateFieldProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: string | null
  onChange?: (value: string | null) => void
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
}

const DateField = ({
  label,
  description,
  className,
  errorComponent: ErrorComponent = FieldError,
  value,
  errorMessage,
  onChange,
  isRequired = false,
  ...props
}: DateFieldProps) => {
  const hasError = !!errorMessage

  const { parsedDate, handleChange } = useDateConversion(value, onChange)

  return (
    <BaseDateField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2 data-invalid:border-destructive', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      onChange={handleChange}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} />
      <DateInput />
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </BaseDateField>
  )
}

const FormDateField = ({ ...props }: DateFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <DateField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { DateField, FormDateField, DateSegment, DateInput, BaseDateField }
export type { DateInputProps, DateFieldProps }
