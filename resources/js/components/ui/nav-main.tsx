import type { IconSvgElement } from '@hugeicons/react'
import { Link } from '@inertiajs/react'
import type { LucideIcon } from 'lucide-react'
import { Icon } from '@/components/twc-ui/icon'
import { usePathActive } from '@/hooks/use-path-active'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from './sidebar'
export type CombinedIcon = LucideIcon | IconSvgElement

export interface NavMainItem {
  title: string
  url: string
  icon: CombinedIcon
  hasSep?: boolean
  activePath?: string
  isActive?: boolean
  exact?: boolean
  items?: NavMainItemChildren[]
}

export interface NavMainItemChildren {
  title: string
  url: string
  activePath?: string
  isActive?: boolean
  hasSep?: boolean
  exact?: boolean
  items?: NavMainItemChildren[]
}

export function NavMain({ items, ...props }: { items: NavMainItem[] }) {
  const isPathActive = usePathActive()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const isItemOrChildActive = isPathActive(item, false, item.items)

            return (
              <Collapsible key={item.title} asChild open={isItemOrChildActive}>
                <SidebarMenuItem className={item.hasSep ? 'mb-3' : ''}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isPathActive(item)}>
                      <Link href={item.url}>
                        <Icon
                          icon={item.icon}
                          size={24}
                          color="currentColor"
                          className="size-5! text-sidebar-foreground!"
                        />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub className="block">
                        {item.items.map(subItem => {
                          const isSubOrChildActive = isPathActive(subItem, false, subItem.items)

                          if (subItem.items?.length) {
                            return (
                              <Collapsible key={subItem.title} asChild open={isSubOrChildActive}>
                                <SidebarMenuSubItem className={subItem.hasSep ? 'mb-3' : ''}>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton
                                      asChild
                                      className="ml-1"
                                      isActive={isPathActive(subItem)}
                                    >
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <SidebarMenuSub className="ml-3 block">
                                      {subItem.items.map(child => (
                                        <SidebarMenuSubItem
                                          key={child.title}
                                          className={child.hasSep ? 'mb-3' : ''}
                                        >
                                          <SidebarMenuSubButton
                                            asChild
                                            className="ml-1"
                                            isActive={isPathActive(child)}
                                          >
                                            <Link href={child.url}>
                                              <span>{child.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuSubItem>
                              </Collapsible>
                            )
                          }

                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className={subItem.hasSep ? 'mb-3' : ''}
                            >
                              <SidebarMenuSubButton
                                asChild
                                className="ml-1"
                                isActive={isPathActive(subItem)}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
