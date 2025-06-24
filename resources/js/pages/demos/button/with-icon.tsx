import { Rocket02Icon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Moon } from 'lucide-react'

export const WithIconDemo = () => {
  return (
    <DemoContainer className="gap-4">
      <Button variant="default" icon={Rocket02Icon} title="Get started" />
      <Button variant="outline" icon={Rocket02Icon} size="icon" title="HugeIcons Icon" />
      <Button variant="outline" icon={Moon} size="icon" title="Lucide icon " />
    </DemoContainer>
  )
}

export default WithIconDemo
