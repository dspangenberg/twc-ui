'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import {
  type ButtonProps as AriaButtonProps,
  type InputProps as AriaInputProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  useLocale
} from 'react-aria-components'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { FieldDescription, FieldError, FieldGroup, Label } from './field'
import { Input } from './text-field'

function BaseSearchField({ className, ...props }: AriaSearchFieldProps) {
  return (
    <AriaSearchField
      className={composeRenderProps(className, className => cn('group', className))}
      {...props}
    />
  )
}

function SearchFieldInput({ className, ...props }: AriaInputProps) {
  return (
    <Input
      className={composeRenderProps(className, className =>
        cn('rounded-none border-x-0', className)
      )}
      {...props}
    />
  )
}
function SearchFieldClear({ className, ...props }: AriaButtonProps) {
  return <Button icon={XIcon} variant="ghost" size="icon-xs" {...props} />
}

interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string
  description?: string
  isRequired?: boolean
  placeholder?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function SearchField({
  label,
  description,
  className,
  isRequired,
  placeholder,
  errorMessage,
  ...props
}: SearchFieldProps) {
  const { locale } = useLocale()

  const searchText = locale.startsWith('de') ? 'Suche …' : 'Search …'
  const realPlaceholder = placeholder ?? searchText

  return (
    <BaseSearchField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2', className)
      )}
      aria-label={!label ? searchText : undefined}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <FieldGroup aria-label="Search">
        <SearchIcon aria-hidden className="size-4 text-muted-foreground" />
        <SearchFieldInput
          placeholder={realPlaceholder}
          type="text"
          className="pressed:ring-0 focus:ring-0"
        />
        <SearchFieldClear />
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </BaseSearchField>
  )
}

export { SearchField, SearchFieldInput, SearchFieldClear }
export type { SearchFieldProps }
