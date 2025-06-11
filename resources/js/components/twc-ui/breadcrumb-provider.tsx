import type { BreadcrumbProp } from '@/components/twc-ui/page-breadcrumbs'
import type React from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type BreadcrumbProviderProps = {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbProp[]
}

type BreadcrumbProviderState = {
  breadcrumbs: BreadcrumbProp[];
  setBreadcrumbs: (items: BreadcrumbProp[]) => void
}

const initialState: BreadcrumbProviderState = {
  breadcrumbs: [],
  setBreadcrumbs: () => null
}

const BreadcrumbProviderContext =
  createContext<BreadcrumbProviderState>(initialState)

export function BreadcrumbProvider ({
  children,
  breadcrumbs: initialBreadcrumbs = [],
  ...props
}: BreadcrumbProviderProps) {
  const [breadcrumbs, setBreadcrumbItems] =
    useState<BreadcrumbProp[]>(initialBreadcrumbs)

  const setBreadcrumbs = useCallback((items: BreadcrumbProp[]) => {
    setBreadcrumbItems(items)
  }, [])

  const value = useMemo<BreadcrumbProviderState>(
    () => ({
      breadcrumbs,
      setBreadcrumbs
    }),
    [breadcrumbs, setBreadcrumbs]
  )

  return (
    <BreadcrumbProviderContext.Provider {...props} value={value}>
      {children}
    </BreadcrumbProviderContext.Provider>
  )
}

export const useBreadcrumbProvider = () => {
  const context = useContext(BreadcrumbProviderContext)
  if (context === undefined) {
    throw new Error(
      'useBreadcrumbProvider must be used within a BreadcrumbProvider'
    )
  }
  return context
}
