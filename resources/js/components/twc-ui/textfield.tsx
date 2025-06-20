import * as React from 'react'
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  composeRenderProps,
  Text
} from 'react-aria-components'
import { useFormContext } from '@/components/twc-ui/form'
import { cn } from '@/lib/utils'
import { FieldError, Label } from './field'

const BaseTextField = AriaTextField

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-base shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ',
          /* Focused */
          /* Resets */
          'focus:border-primary focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
          'data-[invalid]:border-destructive data-[invalid]:focus-visible:border-destructive data-[invalid]:focus-visible:ring-destructive/20',
          className
        )
      )}
      {...props}
      onFocus={event => event.target.select()}
    />
  )
}

const TextArea = ({ className, ...props }: AriaTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 min-h-[80px] w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-base shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          /* Focused */
          /* Resets */
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
          'data-[invalid]:border-destructive data-[invalid]:focus-visible:border-destructive data-[invalid]:focus-visible:ring-destructive/20',
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

function TextField({
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
      {textArea ? <TextArea rows={rows} /> : <Input />}
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </AriaTextField>
  )
}

export { Input, TextField, BaseTextField, TextArea }
