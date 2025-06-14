import { router } from '@inertiajs/react'
import React, { useCallback } from 'react'
import { RouterProvider } from 'react-aria-components'

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useCallback(
    (to: string, options?: Parameters<typeof router.visit>[1]) =>
      router.visit(to, options),
    []
  )

  return (
    <RouterProvider navigate={navigate}>
      {children}
    </RouterProvider>
  )
}

