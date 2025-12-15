import { TextBoldIcon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { ToggleButton } from '@/components/twc-ui/toggle-button'
export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg gap-2">
      <ToggleButton icon={TextBoldIcon} tooltip="Bold" />
      <ToggleButton variant="outline" icon={TextBoldIcon} tooltip="Bold" />
      <ToggleButton variant="toolbar" icon={TextBoldIcon} tooltip="Bold" />
      <ToggleButton size="default" icon={TextBoldIcon} title="Bold" />
      <ToggleButton size="default" title="Bold" />
    </DemoContainer>
  )
}

export default Demo
