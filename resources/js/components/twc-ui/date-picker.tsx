'use client'

import { Calendar04Icon } from '@hugeicons/core-free-icons'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { format, parse } from 'date-fns'
import React from 'react'
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Dialog,
  Text
} from 'react-aria-components'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Calendar, type FooterButtons } from './calendar'
import { DateInput } from './date-field'
import { FieldError, FieldGroup, Label } from './field'
import { Popover } from './popover'

const BaseDatePicker = AriaDatePicker

const DATE_FORMAT = import.meta.env.VITE_APP_DATE_FORMAT || 'yyyy-MM-dd'

const dateValueToDate = (dateValue: DateValue): Date => {
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & { popoverClassName?: AriaPopoverProps['className'] }) => (
  <Popover
    className={composeRenderProps(popoverClassName, className => cn('w-auto p-3', className))}
  >
    <Dialog
      className={cn(
        'pointer-events-auto z-100 flex h-auto w-full flex-col space-y-2 outline-none sm:flex-row sm:space-x-4 sm:space-y-0',
        className
      )}
      {...props}
    />
  </Popover>
)

// DatePicker - orientiert an DateField
interface DatePickerProps extends Omit<AriaDatePickerProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: string | null
  onChange?: (value: string | null) => void
  maxYears?: number
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  footerButtons?: FooterButtons
  isRequired?: boolean
}

const DatePicker = ({
  label,
  description,
  className,
  value,
  maxYears = 100,
  footerButtons,
  errorMessage,
  onChange,
  isRequired = false,
  ...props
}: DatePickerProps) => {
  const hasError = !!errorMessage

  const parsedDate = React.useMemo((): DateValue | null => {
    if (!value) return null

    try {
      const date = parse(value, DATE_FORMAT, new Date())
      if (Number.isNaN(date.getTime())) return null
      return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    } catch {
      return null
    }
  }, [value])

  // Convert DateValue to string (same logic as DateField)
  const handleChange = React.useCallback(
    (newValue: DateValue | null) => {
      if (!onChange) return

      if (!newValue) {
        onChange(null)
        return
      }

      try {
        const jsDate = dateValueToDate(newValue)
        const formattedDate = format(jsDate, DATE_FORMAT)
        onChange(formattedDate)
      } catch {
        onChange(null)
      }
    },
    [onChange]
  )
  return (
    <BaseDatePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      onChange={handleChange}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} isRequired={isRequired} />
      <FieldGroup className="gap-0 px-3 pr-1! data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive/20">
        <DateInput variant="ghost" className="flex-1" />
        <Button
          variant="ghost"
          size="icon-sm"
          icon={Calendar04Icon}
          className="mr-1 size-6 data-focus-visible:ring-offset-0"
        />
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent popoverClassName="min-h-fit" slot="dialog">
        <Calendar
          className="p-0"
          maxYears={maxYears}
          footerButtons={footerButtons}
          onChange={handleChange}
        />
      </DatePickerContent>
    </BaseDatePicker>
  )
}

export { DatePicker, BaseDatePicker }
export type { DatePickerProps }
