import { Rocket02Icon } from '@hugeicons/core-free-icons'
import { Moon } from 'lucide-react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { LinkButton } from '@/components/twc-ui/link-button'

export const WithIconDemo = () => {
  return (
    <DemoContainer className="gap-4">
      <LinkButton
        href="#"
        variant="default"
        size="default"
        icon={Rocket02Icon}
        title="Get started"
      />
      <LinkButton
        href="#"
        variant="outline"
        icon={Rocket02Icon}
        size="icon"
        title="HugeIcons Icon"
      />
      <LinkButton href="#" variant="outline" icon={Moon} size="icon" tooltip="Lucide icon " />
    </DemoContainer>
  )
}

export default WithIconDemo
