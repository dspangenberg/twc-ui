import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type CalloutProps = {
  title?: string
  children: ReactNode
  icon: IconSvgElement
  className?: string
}

export const Callout = ({ children, className, icon, title }: CalloutProps) => {
  return (
    <Alert className={cn('flex items-center text-base', className)}>
      <div className="pr-3">
        <HugeiconsIcon icon={icon} />
      </div>
      <div>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription className="text-base">{children}</AlertDescription>
      </div>
    </Alert>
  )
}
