import type React from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from './scroll-area'

interface FormCardProps {
  className?: string
  innerClassName?: string
  children: React.ReactNode
  footer?: React.ReactNode
  footerClassName?: string
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  className,
  footer,
  footerClassName,
  innerClassName
}) => {
  return (
    <div className={cn('flex h-full flex-1 flex-col overflow-hidden', className)}>
      <div className="border-border/80 bg-page-content relative flex max-h-fit flex-1 flex-col gap-1.5 overflow-hidden rounded-lg border p-1.5">
        <ScrollArea
          className={cn('bg-background min-h-0 flex-1 rounded-md border', innerClassName)}
        >
          {children}
        </ScrollArea>
        {footer && (
          <div
            className={cn(
              'flex w-full flex-none items-center justify-end px-4 py-1.5',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
