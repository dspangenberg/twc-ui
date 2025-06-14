import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Rocket02Icon } from '@hugeicons/core-free-icons'

export const WithIconDemo = () => {
  return (
    <DemoContainer className="gap-4">
      <Button variant="default" icon={Rocket02Icon} title="Get started" />
      <Button variant="outline" icon={Rocket02Icon} size="icon" tooltip="Get started" />
    </DemoContainer>
  )
}

export default WithIconDemo
