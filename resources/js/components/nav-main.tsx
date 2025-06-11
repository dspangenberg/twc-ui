import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import type { NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { HugeiconsIcon } from '@hugeicons/react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage()
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Documentation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={page.url.startsWith(item.href)}
              tooltip={{ children: item.title }}
            >
              <Link href={item.href} prefetch>
                {item.icon && <HugeiconsIcon icon={item.icon} className="size-5" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
