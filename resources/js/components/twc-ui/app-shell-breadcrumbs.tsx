import type React from 'react'

import { useAppShell } from './app-shell-provider'
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs
} from './breadcrumbs'

export type BreadcrumbProp = {
  title: string
  url?: string
}

type PageBreadcrumbsProps = {
  className?: string
}

export const AppShellBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({ className }) => {
  const { breadcrumbs } = useAppShell()

  return (
    <nav aria-label="Breadcrumbs">
      <Breadcrumbs className={className}>
        <BreadcrumbItem>
          <BreadcrumbLink href={route('app.dashboard')}>Dashboard</BreadcrumbLink>
          {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
        {breadcrumbs.map((item: BreadcrumbProp, index: number) => (
          <BreadcrumbItem key={index}>
            {item.url ? (
              <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </nav>
  )
}
