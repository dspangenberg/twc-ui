import type { DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import { useEffect, useState } from 'react'
import { useDateRangeConversion } from '@/hooks/use-date-conversion'
import { DateRangePicker, type DateRangePickerProps } from './date-range-picker'
import { useFormContext } from './form'
import { FormFieldError } from './form-errors'

interface FormDateRangePickerProps extends Omit<DateRangePickerProps, 'value' | 'onChange'> {
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  name: string
}

const FormDateRangePicker = ({ value, onChange, ...props }: FormDateRangePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedDate, handleChange } = useDateRangeConversion(value, onChange)

  // Use internal state to prevent resets during typing
  const [internalValue, setInternalValue] = useState<RangeValue<DateValue> | null>(parsedDate)

  // Update internal value when external value changes
  useEffect(() => {
    if (parsedDate) {
      setInternalValue(parsedDate)
    }
  }, [parsedDate])

  const handleInternalChange = (newValue: RangeValue<DateValue> | null) => {
    setInternalValue(newValue)
    handleChange(newValue)
  }

  return (
    <DateRangePicker
      errorComponent={FormFieldError}
      errorMessage={error}
      value={internalValue}
      onChange={handleInternalChange}
      {...props}
    />
  )
}

export { FormDateRangePicker }
export type { FormDateRangePickerProps }
