import { DemoContainer } from '@/components/docs/DemoContainer'
import { ToggleButton } from '@/components/twc-ui/toggle-button'
import { Rocket02Icon } from '@hugeicons/core-free-icons'
export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg gap-4">
      <ToggleButton icon={Rocket02Icon} tooltip="Get started"/>
      <ToggleButton variant="outline" icon={Rocket02Icon} tooltip="Get started" />
      <ToggleButton variant="toolbar" icon={Rocket02Icon} tooltip="Get started" />
      <ToggleButton size="default" icon={Rocket02Icon} title="Get started"/>
      <ToggleButton size="default" title="Get started"/>
    </DemoContainer>
  )
}

export default Demo
