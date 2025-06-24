import { router } from '@inertiajs/react'
import type React from 'react'
import { useCallback } from 'react'
import { RouterProvider } from 'react-aria-components'
import { DocsStructureProvider } from '@/hooks/use-docs-structure'

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useCallback(
    (to: string, options?: Parameters<typeof router.visit>[1]) => router.visit(to, options),
    []
  )

  return (
    <RouterProvider navigate={navigate}>
      <DocsStructureProvider>{children}</DocsStructureProvider>
    </RouterProvider>
  )
}
