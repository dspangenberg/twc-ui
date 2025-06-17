import * as React from 'react'
import {
  composeRenderProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Text,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components'

import { cn } from '@/lib/utils'
import { FieldError, Label } from './field'
import { useFormContext } from '@/components/twc-ui/form'

const BaseTextField = AriaTextField

const Input = ({
  className,
  ...props
}: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-base font-medium shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ',
          /* Focused */
          /* Resets */
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
          'data-[invalid]:focus-visible:ring-destructive/20  data-[invalid]:focus-visible:border-destructive  data-[invalid]:border-destructive',
          className
        )
      )}
      {...props}
      onFocus={event => event.target.select()}
    />
  )
}

const TextArea = ({
  className,
  ...props
}: AriaTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full min-h-[80px] outline-0 rounded-sm border border-input bg-transparent px-3 py-1 text-base font-medium shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          /* Focused */
          /* Resets */
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
          'data-[invalid]:focus-visible:ring-destructive/20  data-[invalid]:focus-visible:border-destructive  data-[invalid]:border-destructive',
          className
        )
      )}
      onFocus={event => event.target.select()}
      {...props}
    />
  )
}

interface TextFieldProps extends Omit<AriaTextFieldProps, 'onChange'> {
  label?: string
  description?: string
  textArea?: boolean
  rows?: number
  required?: boolean
  onChange?: (value: string) => void
  name?: string
  value?: string
  error?: string | undefined
  onBlur?: () => void
}

function TextField ({
  label,
  description,
  textArea,
  required = false,
  rows = 3,
  className,
  onChange,
  ...props
}: TextFieldProps) {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  return (
    <AriaTextField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      onChange={onChange}
      {...props}
    >
      <Label required={required} value={label} />
      {textArea ? (
        <TextArea
          rows={rows}
        />
      ) : (
        <Input />
      )}
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </AriaTextField>
  )
}

export { Input, TextField, BaseTextField, TextArea }
