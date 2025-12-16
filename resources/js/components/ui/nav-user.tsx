/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Door01Icon, Settings05Icon, UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { router } from '@inertiajs/react'
import { Avatar } from '@/components/twc-ui/avatar'
import { Button } from '@/components/twc-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function NavUser() {
  const handleLogout = () => {
    router.post(route('app.logout', {}, false))
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="mr-4 flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Avatar src="https://github.com/shadcn.png" />
          </Button>
          <div className="cursor-default font-medium text-sm">Shadcn</div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar src="https://github.com/shadcn.png" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Shadcn</span>
              <span className="truncate text-xs">shadcn@example.com</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} />
            Profil + Sicherheit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Settings05Icon} />
            Einstellungen
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <HugeiconsIcon icon={Door01Icon} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
