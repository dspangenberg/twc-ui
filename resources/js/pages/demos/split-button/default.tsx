import {
  Delete02Icon,
  FileEditIcon,
  FileRemoveIcon,
  Files02Icon,
  Sent02Icon
} from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { MenuItem } from '@/components/twc-ui/menu'
import { SplitButton } from '@/components/twc-ui/split-button'

export const Demo = () => {
  return (
    <DemoContainer className="mx-auto w-max-lg items-start gap-4 py-12">
      <SplitButton
        title="Rechnung bearbeiten"
        menuClassName="min-w-64"
        variant="outline"
        onClick={() => console.log('Split button clicked')}
      >
        <MenuItem icon={Sent02Icon} title="Als versendet markieren" separator />
        <MenuItem icon={Files02Icon} title="Rechnung duplizieren" separator />
        <MenuItem icon={FileEditIcon} title="Rechnung korrigieren" />
        <MenuItem icon={FileRemoveIcon} title="Rechnung stornieren" separator />
        <MenuItem icon={Delete02Icon} title="Rechnung löschen" variant="destructive" />
      </SplitButton>
    </DemoContainer>
  )
}

export default Demo
