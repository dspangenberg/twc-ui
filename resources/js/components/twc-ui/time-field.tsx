'use client'

import type React from 'react'
import {
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue as AriaTimeValue,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { useTimeConversion } from '@/hooks/use-date-conversion'
import { cn } from '@/lib/utils'
import { DateInput } from './date-field'
import { FieldError, FormFieldError, Label } from './field'
import { useFormContext } from './form'

const BaseTimeField = AriaTimeField

interface TimeFieldProps<T extends AriaTimeValue> extends AriaTimeFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
}

const TimeField = <T extends AriaTimeValue>({
  label,
  description,
  errorComponent: ErrorComponent = FieldError,
  errorMessage,
  className,
  ...props
}: TimeFieldProps<T>) => {
  const hasError = !!errorMessage

  return (
    <BaseTimeField
      isInvalid={hasError}
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2', className)
      )}
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
    </BaseTimeField>
  )
}

interface FormTimeFieldProps extends Omit<TimeFieldProps<AriaTimeValue>, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormTimeField = ({ value, onChange, ...props }: FormTimeFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedTime, handleChange } = useTimeConversion(value, onChange)

  return <TimeField errorComponent={FormFieldError} errorMessage={error} value={parsedTime} onChange={handleChange} {...props} />
}

export { TimeField, BaseTimeField, FormTimeField }
export type { TimeFieldProps, FormTimeFieldProps }
