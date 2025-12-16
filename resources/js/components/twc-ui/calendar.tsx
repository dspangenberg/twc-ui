'use client'

import { type CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type React from 'react'
import { use } from 'react'
import { useDateFormatter } from 'react-aria'
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  type CalendarState,
  CalendarStateContext,
  type DateValue,
  Heading,
  RangeCalendar,
  Text,
  useLocale
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Select } from './select'

export const cellStyles = tv({
  base: 'relative mt-1 flex size-8 cursor-default items-center justify-center rounded-md p-0 font-normal text-sm transition-[box-shadow] forced-color-adjust-none',
  variants: {
    isSelected: {
      false: 'hover:bg-accent hover:text-accent-foreground',
      true: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
    },
    isDisabled: {
      true: 'text-muted-foreground opacity-50'
    },
    isOutsideMonth: {
      true: 'text-muted-foreground opacity-50'
    },
    isPressed: {
      true: 'border-ring ring-[3px] ring-ring/50'
    },
    isUnavailable: {
      true: 'text-muted-foreground opacity-50'
    },
    isToday: {
      true: 'after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[4px] after:-translate-x-1/2 after:rounded-full after:bg-primary selected:after:bg-primary-fg focus-visible:after:bg-primary-fg'
    }
  }
})

export type FooterButtons = 'reset' | 'today' | 'both' | 'none'
export type HeaderSelects = 'year' | 'month' | 'both' | 'none'

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, 'visibleDuration'> {
  errorMessage?: string
  className?: string
  maxYears?: number
  footerButtons?: FooterButtons
  headerSelects?: HeaderSelects
  onChange?: (value: DateValue | null) => void
}

export const Calendar = <T extends DateValue>({
  errorMessage,
  className,
  maxYears = 100,
  footerButtons = 'both',
  headerSelects = 'both',
  onChange,
  ...props
}: CalendarProps<T>) => {
  const minYear = props.minValue?.year ?? today(getLocalTimeZone()).year - maxYears
  const maxYear = props.maxValue?.year ?? today(getLocalTimeZone()).year

  return (
    <AriaCalendar
      className={cn('flex w-fit select-none flex-col bg-card p-3', className)}
      {...props}
    >
      <CalendarHeader minYear={minYear} maxYear={maxYear} headerSelects={headerSelects} />
      <CalendarGrid className="mt-1 w-full border-collapse">
        <CalendarGridHeader />
        <CalendarGridBody>
          {date => <CalendarCell date={date} className={cellStyles} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="py-2 text-destructive text-sm">
          {errorMessage}
        </Text>
      )}
      <CalendarFooter onChange={onChange} footerButtons={footerButtons} />
    </AriaCalendar>
  )
}

const CalendarHeader = ({
  isRange,
  className,
  headerSelects = 'both',
  minYear,
  maxYear,
  onChange,
  ...props
}: React.ComponentProps<'header'> & {
  isRange?: boolean
  minYear: number
  maxYear: number
  headerSelects?: HeaderSelects
  onChange?: (value: DateValue | null) => void
}) => {
  const { direction } = useLocale()
  const state = use(CalendarStateContext)

  // TODO: HeaderSelects

  if (!state) return null

  const currentDate = state.focusedDate
  const currentYear = currentDate.year
  const currentMonth = currentDate.month

  const isAtMin =
    minYear !== undefined &&
    (currentYear < minYear || (currentYear === minYear && currentMonth === 1))

  const isAtMax =
    maxYear !== undefined &&
    (currentYear > maxYear || (currentYear === maxYear && currentMonth === 12))

  return (
    <header
      data-slot="calendar-header"
      className={cn('flex w-full justify-between gap-1.5 pt-1 pr-1 pb-5 pl-1.5 sm:pb-4', className)}
      {...props}
    >
      {!isRange && (
        <div className="flex items-center gap-1.5">
          <SelectMonth state={state} />
          <SelectYear state={state} minYear={minYear} maxYear={maxYear} />
        </div>
      )}

      <Heading
        className={cn(
          'h-7 flex-1 items-center justify-center font-medium text-base',
          !isRange && 'sr-only',
          className
        )}
      />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" slot="previous" isDisabled={isAtMin}>
          {direction === 'rtl' ? (
            <ChevronRight aria-hidden className="size-4" />
          ) : (
            <ChevronLeft aria-hidden className="size-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon-sm" slot="next" isDisabled={isAtMax}>
          {direction === 'rtl' ? (
            <ChevronLeft aria-hidden className="size-4" />
          ) : (
            <ChevronRight aria-hidden className="size-4" />
          )}
        </Button>
      </div>
    </header>
  )
}

const CalendarFooter = ({
  footerButtons = 'both',
  onChange
}: {
  footerButtons?: FooterButtons
  onChange?: (value: DateValue | null) => void
}) => {
  const state = use(CalendarStateContext)
  const { locale } = useLocale()
  if (!state) return null

  const todayButtonText = locale.startsWith('de') ? 'Heute' : 'Today'
  const resetButtonText = locale.startsWith('de') ? 'Zurücksetzen' : 'Clear'

  if (footerButtons === 'none') return null
  return (
    <footer className="flex items-center justify-between gap-2 pt-3">
      {['today', 'both'].includes(footerButtons) && (
        <Button
          variant="outline"
          size="full"
          title={todayButtonText}
          onClick={() => state.setFocusedDate(today(getLocalTimeZone()))}
          slot={null}
        />
      )}
      {['reset', 'both'].includes(footerButtons) && (
        <Button
          variant="outline"
          size="full"
          title={resetButtonText}
          onClick={() => {
            state.setValue(null)
            onChange?.(null)
          }}
          slot={null}
        />
      )}
    </footer>
  )
}

export const CalendarGridHeader = () => {
  return (
    <AriaCalendarGridHeader>
      {day => (
        <CalendarHeaderCell className="font-medium text-foreground text-sm">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  )
}

const SelectMonth = ({ state }: { state: CalendarState }) => {
  const months: { id: string; name: string }[] = []

  const formatter = useDateFormatter({
    month: 'short',
    timeZone: state.timeZone
  })

  const numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate)
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i })
    months.push({
      id: i.toString(),
      name: formatter.format(date.toDate(state.timeZone))
    })
  }
  return (
    <Select
      aria-label="Select month"
      className="w-22"
      value={state.focusedDate.month.toString() ?? (new Date().getMonth() + 1).toString()}
      items={months}
      onChange={value => {
        state.setFocusedDate(state.focusedDate.set({ month: Number(value) }))
      }}
    />
  )
}

const SelectYear = ({
  minYear,
  maxYear,
  state
}: {
  state: CalendarState
  minYear: number
  maxYear: number
}) => {
  const years: { id: number; name: string; date: CalendarDate }[] = []
  const formatter = useDateFormatter({
    year: 'numeric',
    timeZone: state.timeZone
  })

  for (let i = minYear; i <= maxYear; i++) {
    const date = state.focusedDate.set({ year: i })
    years.push({
      id: i,
      name: formatter.format(date.toDate(state.timeZone)),
      date: date
    })
  }

  return (
    <Select
      aria-label="Select year"
      className="w-22"
      value={state.focusedDate.year}
      items={years}
      onChange={value => {
        const selectedYear = years.find(y => y.id === Number(value))
        if (selectedYear) {
          state.setFocusedDate(selectedYear.date)
        }
      }}
    />
  )
}

export {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarHeader as CalendarHeading,
  RangeCalendar
}
