import type * as React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'

interface AppContentProps extends React.ComponentProps<'main'> {
  variant?: 'header' | 'sidebar'
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
  if (variant === 'sidebar') {
    return <SidebarInset {...props}>{children}</SidebarInset>
  }

  return (
    <main
      className="max-w-8xl mx-auto flex h-full w-full flex-1 flex-col gap-4 rounded-xl"
      {...props}
    >
      {children}
    </main>
  )
}
