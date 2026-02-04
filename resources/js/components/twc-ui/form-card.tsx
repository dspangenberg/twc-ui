import type React from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from './scroll-area'

interface FormCardProps {
  className?: string
  innerClassName?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  className,
  footer,
  innerClassName
}) => {
  return (
    <div className={cn('flex flex-1 flex-col overflow-hidden', className)}>
      <div className="relative flex flex-1 flex-col gap-1.5 overflow-hidden rounded-lg border border-border/80 bg-page-content p-1.5">
        <ScrollArea
          className={cn('min-h-0 flex-1 rounded-md border bg-background', innerClassName)}
        >
          {children}
        </ScrollArea>
        {footer && (
          <div
            className={cn('flex w-full flex-none items-center justify-end px-4 py-1.5', className)}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
