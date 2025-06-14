import { router } from '@inertiajs/react'
import React from 'react'
import { RouterProvider } from 'react-aria-components'

export function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <RouterProvider navigate={(to, options) => router.visit(to, options)}>
      {children}
    </RouterProvider>
  )
}

