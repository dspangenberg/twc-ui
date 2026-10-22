import type { PropsWithChildren } from 'react'
import { AppContent } from '@/components/app-content'
import { AppHeader } from '@/components/app-header'
import { AppShell } from '@/components/app-shell'
import { TwicewareSolution } from '@/components/twc-ui/TwicewareSolution'
import type { BreadcrumbItem } from '@/types'

export default function AppHeaderLayout({
  children,
  breadcrumbs
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent className="max-w-8xl mx-auto w-full flex-1 overflow-scroll">
        {children}
      </AppContent>
      <div className="w-screen border-t">
        <div className="max-w-8xl mx-auto flex w-full flex-none flex-col p-2 py-6 text-center text-sm">
          <TwicewareSolution
            appName="twc-ui"
            appWebsite="https://ui.twiceware.cloud"
            copyrightHolder="Danny Spangenberg"
            copyrightYear={2025}
          />
        </div>
      </div>
    </AppShell>
  )
}
