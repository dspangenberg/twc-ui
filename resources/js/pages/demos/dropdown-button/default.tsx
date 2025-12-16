import {
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EditTableIcon,
  EuroReceiveIcon,
  FileDownloadIcon,
  FileEditIcon,
  FileRemoveIcon,
  Files02Icon,
  MoreVerticalCircle01Icon,
  Pdf02Icon,
  PrinterIcon,
  RepeatIcon,
  Sent02Icon
} from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import {
  DropdownButton,
  Menu,
  MenuItem,
  MenuPopover,
  MenuSubTrigger
} from '@/components/twc-ui/dropdown-button'

export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg items-start gap-4 py-12">
      <DropdownButton
        variant="outline"
        size="icon"
        icon={MoreVerticalCircle01Icon}
        menuClassName="min-w-64"
      >
        <MenuItem icon={Pdf02Icon} title="PDF-Vorschau" ellipsis />
        <MenuItem icon={PrinterIcon} title="Rechnung drucken" ellipsis separator />
        <MenuSubTrigger>
          <MenuItem title="Erweitert" />
          <MenuPopover>
            <Menu>
              <MenuItem icon={Sent02Icon} title="Als versendet markieren" separator />
              <MenuItem icon={Files02Icon} title="Rechnung duplizieren" separator />
              <MenuItem icon={RepeatIcon} title="Wiederkehrende Rechnung" separator ellipsis />
              <MenuItem icon={FileEditIcon} title="Rechnung korrigieren" />
              <MenuItem icon={FileRemoveIcon} title="Rechnung stornieren" separator />
              <MenuItem icon={Delete02Icon} title="Rechnung löschen" variant="destructive" />
            </Menu>
          </MenuPopover>
        </MenuSubTrigger>
      </DropdownButton>
    </DemoContainer>
  )
}

export default Demo
