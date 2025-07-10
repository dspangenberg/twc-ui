import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Text,
  type ValidationResult as AriaValidationResult
} from 'react-aria-components'

import { cn } from '@/lib/utils'

import { Button } from './button'
import { FieldError, FieldGroup, Label } from './field'
import { useFormContext } from '@/components/twc-ui/form'
import * as React from 'react'

const BaseNumberField = AriaNumberField

const defaultFormatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'EUR'
}

const NumberFieldInput = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'w-fit min-w-0 outline-0 flex-1 border-0 text-right text-base border-transparent bg-background pl-0 pr-4 mr-2 placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden ',
          className
        )
      )}
      onFocus={event => event.target.select()}
      {...props}
    />
  )
}

const NumberFieldSteppers = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('absolute right-0 flex h-full flex-col border-l', className)} {...props}>
      <NumberFieldStepper slot="increment">
        <ChevronUp aria-hidden className="size-4" />
      </NumberFieldStepper>
      <div className="border-b" />
      <NumberFieldStepper slot="decrement">
        <ChevronDown aria-hidden className="size-4" />
      </NumberFieldStepper>
    </div>
  )
}

const NumberFieldStepper = ({ className, ...props }: AriaButtonProps) => {
  return (
    <Button
      className={composeRenderProps(className, className =>
        cn('w-auto grow rounded-none px-0.5 text-muted-foreground', className)
      )}
      variant={'ghost'}
      size={'icon'}
      {...props}
    />
  )
}

interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'value' | 'onChange'> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  onChange?: ((value: number | null) => void) | ((value: number) => void)
  value?: number | null | undefined
  error?: string | undefined
  name?: string
}

const NumberField = ({
  label,
  description,
  errorMessage,
  className,
  formatOptions,
  isRequired = false,
  isInvalid = false,
  onChange,
  value,
  ...props
}: NumberFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  if (formatOptions === undefined) {
    formatOptions = defaultFormatOptions
  }

  const handleChange = (val: number) => {
    if (onChange) {
      try {
        // Wenn onChange null akzeptiert, verwende val direkt (kann NaN sein)
        onChange(isNaN(val) ? 0 : val)
      } catch {
        // Falls onChange nur number akzeptiert, verwende 0 als Fallback
        ;(onChange as (value: number) => void)(isNaN(val) ? 0 : val)
      }
    }
  }

  return (
    <BaseNumberField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      formatOptions={formatOptions}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      <Label value={label} isRequired={isRequired} isInvalid={hasError} />
      <FieldGroup isInvalid={hasError}>
        <NumberFieldInput className="focus:ring-0 outline:0" />
        <NumberFieldSteppers />
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </BaseNumberField>
  )
}

export { BaseNumberField, NumberFieldInput, NumberFieldSteppers, NumberFieldStepper, NumberField }
