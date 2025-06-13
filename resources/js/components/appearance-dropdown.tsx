import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAppearance } from '@/hooks/use-appearance'
import type { HTMLAttributes } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ComputerIcon, Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons'

export default function AppearanceToggleDropdown ({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const {
    appearance,
    updateAppearance
  } = useAppearance()

  const getCurrentIcon = () => {
    switch (appearance) {
      case 'dark':
        return <HugeiconsIcon icon={Moon02Icon} className="size-5" />
      case 'light':
        return <HugeiconsIcon icon={Sun02Icon} className="size-5" />
      default:
        return <HugeiconsIcon icon={ComputerIcon} className="size-5" />
    }
  }

  return (
    <div className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => updateAppearance('light')}>
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Sun02Icon} className="size-5" />
              Light
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateAppearance('dark')}>
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Moon02Icon} className="size-5" />
              Dark
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateAppearance('system')}>
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={ComputerIcon} className="size-5" />
              System
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
