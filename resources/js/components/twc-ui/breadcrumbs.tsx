'use client'

import { ChevronRightIcon, MoreHorizontal } from 'lucide-react'
import type React from 'react'
import {
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbProps as AriaBreadcrumbProps,
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps
} from 'react-aria-components'
import { cn } from '@/lib/utils'

const Breadcrumbs = <T extends object>({ className, ...props }: AriaBreadcrumbsProps<T>) => (
  <AriaBreadcrumbs
    className={cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5',
      className
    )}
    {...props}
  />
)

const BreadcrumbItem = ({ className, ...props }: AriaBreadcrumbProps) => (
  <AriaBreadcrumb
    className={cn('inline-flex items-center gap-1.5 sm:gap-2.5', className)}
    {...props}
  />
)

const BreadcrumbLink = ({ className, ...props }: AriaLinkProps) => (
  <AriaLink
    className={composeRenderProps(className, className =>
      cn(
        'text-foreground transition-colors',
        /* Hover */
        'data-hovered:underline',
        /* Disabled */
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        /* Current */
        'current:pointer-events-auto current:opacity-100',
        className
      )
    )}
    {...props}
  />
)

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children || <ChevronRightIcon aria-hidden className="size-3.5" />}
  </span>
)

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex size-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
)

interface BreadcrumbPageProps extends Omit<AriaLinkProps, 'href'> {}

const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => (
  <AriaLink
    className={composeRenderProps(className, className =>
      cn('text-foreground/80 font-medium', className)
    )}
    {...props}
  />
)

export {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
}
