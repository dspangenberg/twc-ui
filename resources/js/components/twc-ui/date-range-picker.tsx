'use client'

import { Calendar04Icon } from '@hugeicons/core-free-icons'
import type { DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import type React from 'react'
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Dialog,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { useFormContext } from '@/components/twc-ui/form'
import { useDateRangeConversion } from '@/hooks/use-date-conversion'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { DateInput } from './date-field'
import { FieldError, FieldGroup, FormFieldError, Label } from './field'
import { Popover } from './popover'
import { type FooterButtons, RangeCalendar } from './range-calendar'

const BaseDateRangePicker = AriaDateRangePicker

interface DateRangePickerProps
  extends Omit<AriaDateRangePickerProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
  name: string
  maxYears?: number
  footerButtons?: FooterButtons
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
const DateRangePicker = ({
  label,
  description,
  className,
  errorMessage,
  value,
  maxYears = 50,
  onChange,
  isRequired = false,
  errorComponent: ErrorComponent = FieldError,
  ...props
}: DateRangePickerProps) => {
  const hasError = !!errorMessage

  const { parsedDate, handleChange } = useDateRangeConversion(value, onChange)

  return (
    <BaseDateRangePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      onChange={handleChange}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} />
      <FieldGroup className="gap-2 px-3">
        <div className="flex flex-1 items-center justify-start gap-1">
          <DateInput className="flex-1" variant="ghost" slot={'start'} />
          <span aria-hidden className="flex-auto text-center text-base text-muted-foreground">
            -
          </span>
          <DateInput className="flex-auto" variant="ghost" slot={'end'} />
        </div>

        <div className="flex flex-none items-center justify-end gap-1">
          <Button
            icon={Calendar04Icon}
            variant="ghost"
            size="icon-sm"
            className="data-focus-visible:ring-offset-0"
          />
        </div>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <ErrorComponent>{errorMessage}</ErrorComponent>
      <DatePickerContent popoverClassName="min-h-[360px]">
        <RangeCalendar
          className="p-0"
          footerButtons={props.footerButtons}
          maxYears={maxYears}
          onChange={handleChange}
        />
      </DatePickerContent>
    </BaseDateRangePicker>
  )
}

const FormDateRangePicker = ({ ...props }: DateRangePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <DateRangePicker errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { DateRangePicker, BaseDateRangePicker, FormDateRangePicker }
export type { DateRangePickerProps }
