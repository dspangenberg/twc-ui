import { DemoContainer } from '@/components/docs/DemoContainer'
import { RangeCalendar } from '@/components/twc-ui/range-calendar'

export default function Dashboard() {
  return (
    <DemoContainer className="items-start">
      <RangeCalendar autoFocus headerSelects="month" />
    </DemoContainer>
  )
}
