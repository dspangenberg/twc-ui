import { DemoContainer } from '@/components/docs/DemoContainer'
import { Avatar } from '@/components/twc-ui/avatar'

export default function Dashboard() {
  return (
    <DemoContainer>
      <Avatar src="/ds.png" initials="DS" size="lg" />
      <Avatar fullname="Danny Spangenberg" size="lg" />
      <Avatar fullname="Tim Cook" size="lg" />
      <Avatar initials="BS" size="lg" />
    </DemoContainer>
  )
}
