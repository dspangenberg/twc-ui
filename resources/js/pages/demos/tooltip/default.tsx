import { Rocket02Icon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Icon } from '@/components/twc-ui/icon'
import { Tooltip, TooltipTrigger } from '@/components/twc-ui/tooltip'
import { Focusable } from 'react-aria-components'

export const Demo = () => {
  return (
    <DemoContainer className="gap-4">
      <TooltipTrigger>
        <Focusable>
          <Icon icon={Rocket02Icon} className="size-6" />
        </Focusable>
        <Tooltip>This a rocket icon tooltip</Tooltip>
      </TooltipTrigger>
    </DemoContainer>
  )
}

export default Demo
