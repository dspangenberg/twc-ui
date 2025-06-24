import { Rocket02Icon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Moon } from 'lucide-react'
import { Icon } from '@/components/twc-ui/icon'

export const Demo = () => {
  return (
    <DemoContainer className="gap-4">
      <Icon icon={Rocket02Icon} className="size-10" />
      <Icon icon={Moon} className="size-10"  />
    </DemoContainer>
  )
}

export default Demo
