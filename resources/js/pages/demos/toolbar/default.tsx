import { Delete02Icon, Pen01Icon, PrinterIcon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Toolbar, ToolbarButton } from '@/components/twc-ui/toolbar'
export const ToolbarDemo = () => {
  return (

    <DemoContainer className="gap-4 flex-col">
      <h5>Default Sidebar</h5>
      <Toolbar>
        <ToolbarButton variant="primary" icon={Pen01Icon} title="Edit" />
        <ToolbarButton icon={PrinterIcon} title="Print" />
        <ToolbarButton icon={Delete02Icon} title="Delete" />
      </Toolbar>
      <h5>Secondary Sidebar</h5>
      <Toolbar variant="secondary" isDisabled>
        <ToolbarButton variant="primary" icon={Pen01Icon} title="Edit" />
        <ToolbarButton icon={PrinterIcon} title="Print" />
        <ToolbarButton icon={Delete02Icon} title="Delete" />
      </Toolbar>
    </DemoContainer>
  )
}

export default ToolbarDemo
