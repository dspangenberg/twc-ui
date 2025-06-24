import { Pen01Icon, PrinterIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Toolbar } from '@/components/twc-ui/toolbar'

export const ToolbarDemo = () => {
  return (
    <DemoContainer className="gap-4">
      <Toolbar>
        <Button variant="toolbar-default" icon={Pen01Icon} title="Edit" />
        <Button variant="toolbar" icon={PrinterIcon}  title="Print" />
        <Button variant="toolbar" icon={Delete02Icon}  title="Delete" />
      </Toolbar>
      <Toolbar variant="secondary">
        <Button variant="toolbar-default" icon={Pen01Icon} title="Edit" />
        <Button variant="toolbar" icon={PrinterIcon}  title="Print" />
        <Button variant="toolbar" icon={Delete02Icon}  title="Delete" />
      </Toolbar>
    </DemoContainer>
  )
}

export default ToolbarDemo
