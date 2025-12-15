import {
  AlignBoxMiddleCenterIcon,
  AlignBoxMiddleLeftIcon,
  AlignBoxMiddleRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon
} from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Separator } from '@/components/twc-ui/separator'
import { ToggleButtonGroup, ToggleButtonGroupItem } from '@/components/twc-ui/toggle-button-group'
import { Toolbar } from '@/components/twc-ui/toolbar'
export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg gap-4">
      <Toolbar>
        <ToggleButtonGroup
          key="alignment"
          id="alignment"
          selectionMode="single"
          variant="toolbar"
          defaultSelectedKeys={['left']}
        >
          <ToggleButtonGroupItem id="left" icon={AlignBoxMiddleLeftIcon} tooltip="Left aligned" />
          <ToggleButtonGroupItem id="centered" icon={AlignBoxMiddleCenterIcon} tooltip="Centered" />
          <ToggleButtonGroupItem
            id="right"
            icon={AlignBoxMiddleRightIcon}
            tooltip="Right aligned"
          />
        </ToggleButtonGroup>
        <Separator orientation="vertical" />
        <ToggleButtonGroup
          key="format"
          id="format"
          selectionMode="multiple"
          variant="toolbar"
          defaultSelectedKeys={['bold', 'italic']}
        >
          <ToggleButtonGroupItem id="bold" icon={TextBoldIcon} tooltip="Bold" />
          <ToggleButtonGroupItem id="italic" icon={TextItalicIcon} tooltip="Italic" />
          <ToggleButtonGroupItem id="underlined" icon={TextUnderlineIcon} tooltip="Underlined" />
        </ToggleButtonGroup>
      </Toolbar>
    </DemoContainer>
  )
}

export default Demo
