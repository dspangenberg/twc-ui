import { DemoContainer } from '@/components/docs/DemoContainer'
import { Calendar } from '@/components/twc-ui/calendar'

export default function Dashboard() {
  return (
    <DemoContainer className="items-start">
      <Calendar autoFocus />
    </DemoContainer>
  )
}
