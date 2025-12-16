'use client'

import { Calendar04Icon, MultiplicationSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { CalendarDate, type DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import { format, parse } from 'date-fns'
import React from 'react'
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  DateRangePickerStateContext,
  Dialog,
  Text
} from 'react-aria-components'
import { useFormContext } from '@/components/twc-ui/form'
import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  type FooterButtons,
  RangeCalendar
} from './calendar'
import { DateInput } from './date-field'
import { FieldError, FieldGroup, Label } from './field'
import { Popover } from './popover'

const BaseDatePicker = AriaDatePicker
const BaseDateRangePicker = AriaDateRangePicker

const DATE_FORMAT = import.meta.env.VITE_DATE_FORMAT || 'yyyy-MM-dd'

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

const DateRangePickerClearButton = () => {
  const state = React.useContext(DateRangePickerStateContext)

  return (
    <Button
      slot={null}
      variant="ghost"
      aria-label="Clear"
      size="icon"
      className="size-6 flex-none data-focus-visible:ring-offset-0"
      onPress={() => state?.setValue(null)}
    >
      <HugeiconsIcon icon={MultiplicationSignIcon} className="size-4" />
    </Button>
  )
}

// DatePicker - orientiert an DateField
interface DatePickerProps extends Omit<AriaDatePickerProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: string | null
  onChange?: (value: string | null) => void
  maxYears?: number
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  footerButtons?: FooterButtons
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
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || errorMessage
  const hasError = !!error

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
  const state = React.useContext(DateRangePickerStateContext)
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
      <Label value={label} />
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
          minValue={props.minValue}
          maxValue={props.maxValue}
          maxYears={maxYears}
          footerButtons={footerButtons}
          onChange={handleChange}
        />
      </DatePickerContent>
    </BaseDatePicker>
  )
}

interface DateRangePickerProps
  extends Omit<AriaDateRangePickerProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  error?: string | ((validation: AriaValidationResult) => string)
  name: string
}

const DateRangePicker = ({
  label,
  description,
  className,
  value,
  onChange,
  isRequired = false,
  ...props
}: DateRangePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  const parsedDate = React.useMemo((): RangeValue<DateValue> | null => {
    if (!value?.start || !value.end) return null

    try {
      const startDate = parse(value.start, DATE_FORMAT, new Date())
      const endDate = parse(value.end, DATE_FORMAT, new Date())

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null

      return {
        start: new CalendarDate(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate()
        ),
        end: new CalendarDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate())
      }
    } catch {
      return null
    }
  }, [value?.start, value?.end])

  const handleChange = React.useCallback(
    (newValue: RangeValue<DateValue> | null) => {
      if (!onChange) return

      if (!newValue?.start || !newValue.end) {
        onChange(null)
        return
      }

      try {
        const startDate = dateValueToDate(newValue.start)
        const endDate = dateValueToDate(newValue.end)
        const formattedRange = {
          start: format(startDate, DATE_FORMAT),
          end: format(endDate, DATE_FORMAT)
        }
        onChange(formattedRange)
      } catch {
        onChange(null)
      }
    },
    [onChange]
  )

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
          <DateRangePickerClearButton />
          <Button variant="ghost" size="icon" className="size-6 data-focus-visible:ring-offset-0">
            <HugeiconsIcon icon={Calendar04Icon} className="size-4" />
          </Button>
        </div>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
      <DatePickerContent popoverClassName="min-h-[360px]">
        <RangeCalendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {day => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>{date => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      </DatePickerContent>
    </BaseDateRangePicker>
  )
}

export { DatePicker, DateRangePicker, BaseDatePicker, BaseDateRangePicker }
export type { DatePickerProps, DateRangePickerProps }
