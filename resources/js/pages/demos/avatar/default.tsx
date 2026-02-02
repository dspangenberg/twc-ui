import { DemoContainer } from '@/components/docs/DemoContainer'
import { Avatar } from '@/components/twc-ui/avatar'
import { Icon } from '@/components/twc-ui/icon'
import { Rocket02Icon } from '@hugeicons/core-free-icons'
export default function Dashboard () {
  return (
    <DemoContainer>
      <div className="flex items-center gap-4">
        <Avatar src="https://github.com/shadcn.png" initials="DS" size="lg" badge="9"/>
        <Avatar fullname="Homer Simpson" size="lg" />
        <Avatar fullname="Tim Cook" size="lg" variant="warning" badge={
          <Icon icon={Rocket02Icon} />
        } />
        <Avatar fullname="Jean-Claude Van Damme" size="lg" badge="15" variant="destructive" />
      </div>
    </DemoContainer>
  )
}
