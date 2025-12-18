'use client'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ChevronLeft, ChevronRight, ChevronsUpDown, Dot } from 'lucide-react'
import type React from 'react'
import { use } from 'react'
import { useDateFormatter } from 'react-aria'
import {
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  composeRenderProps,
  type DateValue,
  Dialog,
  Heading,
  Pressable,
  RangeCalendarStateContext,
  type RangeValue,
  Text,
  useLocale
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { CalendarGridHeader, cellStyles as calendarCellStyles } from './calendar'
import { Icon } from './icon'
import { BaseMenuItem, Menu, MenuItem, MenuPopover, MenuTrigger } from './menu'

const cellStyles = tv({
  extend: calendarCellStyles,
  variants: {
    isSelected: {
      false: 'hover:bg-accent hover:text-accent-foreground',
      true: [
        'relative rounded-none bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        "after:absolute after:-right-1 after:h-full after:w-1 after:bg-primary after:content-['']"
      ]
    },
    isSelectionStart: {
      true: 'rounded-l-md'
    },
    isSelectionEnd: {
      true: 'rounded-r-md after:content-none'
    }
  }
})

export type FooterButtons = 'reset' | 'today' | 'both' | 'none'

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, 'visibleDuration' | 'onChange'> {
  errorMessage?: string
  className?: string
  footerButtons?: FooterButtons
  onChange?: (value: RangeValue<DateValue> | null) => void
}

export const RangeCalendar = <T extends DateValue>({
  errorMessage,
  className,
  footerButtons = 'both',
  onChange,
  ...props
}: RangeCalendarProps<T>) => {
  return (
    <AriaRangeCalendar
      className={cn('flex w-fit select-none flex-col bg-card p-3', className)}
      {...props}
    >
      <RangeCalendarHeader />
      <CalendarGrid className="mt-1 w-full border-collapse" weekdayStyle="short">
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
    </AriaRangeCalendar>
  )
}

const RangeCalendarHeader = ({ className, ...props }: React.ComponentProps<'header'>) => {
  const { direction } = useLocale()
  const state = use(RangeCalendarStateContext)

  if (!state) return null

  const currentDate = state.focusedDate
  const currentYear = currentDate.year
  const currentMonth = currentDate.month

  const minYear = state.minValue?.year
  const maxYear = state.maxValue?.year

  const isAtMin =
    minYear !== undefined &&
    (currentYear < minYear || (currentYear === minYear && currentMonth === 1))

  const isAtMax =
    maxYear !== undefined &&
    (currentYear > maxYear || (currentYear === maxYear && currentMonth === 12))

  const formatter = useDateFormatter({
    month: 'long',
    year: 'numeric',
    timeZone: state.timeZone
  })

  const currentMonthName = formatter.format(state.focusedDate.toDate(state.timeZone))

  console.log(currentMonthName)
  return (
    <header
      data-slot="calendar-header"
      className={cn(
        'flex w-full flex-1 items-center justify-between gap-x-0.5 pr-1 pb-3',
        className
      )}
      {...props}
    >
      <MenuTrigger>
        <Pressable>
          <span
            role="menubar"
            className="inline-flex w-36 flex-1 items-center justify-between gap-1 truncate rounded-sm border border-input bg-transparent px-3 py-2 font-medium text-sm"
          >
            {currentMonthName} <Icon icon={ChevronsUpDown} className="size-4 opacity-50" />
          </span>
        </Pressable>
        <MenuPopover>
          <Menu className="">
            <BaseMenuItem id="test-2">Dezember</BaseMenuItem>
            <BaseMenuItem>2025</BaseMenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>

      <div className="flex items-center">
        <Button variant="ghost" size="icon-sm" slot="previous" isDisabled={isAtMin}>
          {direction === 'rtl' ? (
            <ChevronRight aria-hidden className="size-4" />
          ) : (
            <ChevronLeft aria-hidden className="size-4" />
          )}
        </Button>

        <Button
          icon={Dot}
          variant="ghost"
          size="icon-sm"
          slot={null}
          iconClassName="text-primary size-8"
          tooltip="Heute"
          onClick={() => state?.setFocusedDate(today(getLocalTimeZone()))}
        />

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

const RangeCalendarFooter = ({
  footerButtons = 'both',
  onChange
}: {
  footerButtons?: FooterButtons
  onChange?: (value: RangeValue<DateValue> | null) => void
}) => {
  const state = use(RangeCalendarStateContext)
  const { locale } = useLocale()
  if (!state) return null

  const todayButtonText = locale.startsWith('de') ? 'Heute' : 'Today'
  const resetButtonText = locale.startsWith('de') ? 'Zurücksetzen' : 'Clear'

  return (
    <footer className="flex items-center justify-between gap-2 pt-3">
      {['today', 'both'].includes(footerButtons) && (
        <Button
          variant="outline"
          size="full"
          title={todayButtonText}
          onClick={() => {
            const todayDate = today(getLocalTimeZone())
            state.setFocusedDate(todayDate)
          }}
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
