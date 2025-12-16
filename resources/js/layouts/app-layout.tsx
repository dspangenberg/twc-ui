import { SidebarLeftIcon } from '@hugeicons/core-free-icons'
import type React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { NavUser } from '@/components/nav-user'
import { AppShellBreadcrumbs } from '@/components/twc-ui/app-shell-breadcrumbs'
import { AppShellContainer } from '@/components/twc-ui/app-shell-container'
import { AppShellProvider, useAppShell } from '@/components/twc-ui/app-shell-provider'
import { Button } from '@/components/twc-ui/button'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const SidebarContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { toggleSidebar } = useSidebar()

  const isDev = import.meta.env.MODE === 'development'
  const { backgroundClass } = useAppShell()

  return (
    <>
      <AppSidebar />
      {isDev && (
        <div className="fixed top-0 right-0 z-50 rounded-bl bg-blue-500 px-2 font-mono text-white text-xs">
          <span className="sm:hidden">xs</span>
          <span className="hidden sm:inline md:hidden">sm</span>
          <span className="hidden md:inline lg:hidden">md</span>
          <span className="hidden lg:inline xl:hidden">lg</span>
          <span className="hidden xl:inline 2xl:hidden">xl</span>
          <span className="3xl:hidden hidden 2xl:inline">2xl</span>
          <span className="3xl:inline hidden">3xl</span>
        </div>
      )}
      <SidebarInset className="relative border-0">
        <div className="z-20 flex h-10 items-center">
          <AppShellContainer className="flex w-full flex-1 items-center px-4 py-1">
            <div className="flex flex-1 items-center justify-between space-x-2">
              <Button
                variant="outline"
                icon={SidebarLeftIcon}
                onClick={toggleSidebar}
                title="Sidebar umschalten"
                aria-label="Sidebar umschalten"
                size="icon-sm"
              />
              <AppShellBreadcrumbs className="hidden flex-1 md:flex" />
              <div className="flex-none">
                <NavUser />
              </div>
            </div>
          </AppShellContainer>
        </div>
        <div
          className={cn(
            'absolute top-12 right-0 bottom-0 left-0 overflow-hidden rounded-lg shadow-sm',
            backgroundClass
          )}
        >
          <div className="mt-6">{children}</div>
        </div>
      </SidebarInset>
    </>
  )
}

export default function AppLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <AppShellProvider width="7xl">
      <SidebarProvider>
        <SidebarContent>{children}</SidebarContent>
      </SidebarProvider>
    </AppShellProvider>
  )
}
