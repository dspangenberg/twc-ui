import {
  CreditCardIcon,
  Logout02Icon,
  PrinterIcon,
  UserCircleIcon
} from '@hugeicons/core-free-icons'
import { Pressable } from 'react-aria-components'
import { DemoContainer } from '@/components/docs/DemoContainer'

import { Avatar } from '@/components/twc-ui/avatar'
import { DropdownButton, MenuHeader, MenuItem } from '@/components/twc-ui/dropdown-button'
export const Demo = () => {
  return (
    <DemoContainer className="my-12 w-max-lg items-start gap-2">
      <DropdownButton
        menuClass="min-w-64"
        triggerElement={
          <Pressable>
            <Avatar src="/ds.png" initials="DS" size="lg" />
          </Pressable>
        }
      >
        <MenuHeader>
          <div className="flex items-center gap-2">
            <Avatar src="/ds.png" initials="DS" size="lg" />
            <div className="text-base">
              Danny
              <div className="font-normal text-sm">danny@example.com</div>
            </div>
          </div>
        </MenuHeader>
        <MenuItem icon={UserCircleIcon} title="Account" ellipsis />
        <MenuItem icon={CreditCardIcon} title="Billing" ellipsis />
        <MenuItem icon={PrinterIcon} title="Notifications" ellipsis separator />
        <MenuItem icon={Logout02Icon} title="Logout" />
      </DropdownButton>
    </DemoContainer>
  )
}

export default Demo
