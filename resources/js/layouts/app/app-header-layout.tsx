import { Link } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'
import { AppContent } from '@/components/app-content'
import { AppHeader } from '@/components/app-header'
import { AppShell } from '@/components/app-shell'
import type { BreadcrumbItem } from '@/types'

export default function AppHeaderLayout({
  children,
  breadcrumbs
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent>{children}</AppContent>
      <div className="w-full border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-1 p-2 text-center text-sm">
          Made in the European Union.
          <Link href={route('imprint')} className="ml-1 underline">
            Imprint
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
