import { AppContent } from '@/components/app-content'
import { AppHeader } from '@/components/app-header'
import { AppShell } from '@/components/app-shell'
import type { BreadcrumbItem } from '@/types'
import type { PropsWithChildren } from 'react'
import { Link } from '@inertiajs/react'

export default function AppHeaderLayout ({
  children,
  breadcrumbs
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent>{children}</AppContent>
      <div className="w-full border-t">
        <div className="mx-auto max-w-7xl flex w-full flex-1 p-2 text-sm text-center">
          Made in the European Union.
          <Link href={route('legal')} className="ml-1 underline">
            Imprint
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
