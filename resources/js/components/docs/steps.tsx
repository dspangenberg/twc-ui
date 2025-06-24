import React from 'react'
import { cn } from '@/lib/utils' // oder der entsprechende Pfad zu Ihrer cn-Funktion

const Step = ({ className, ...props }: React.ComponentProps<'h3'>) => (
  <h3
    className={cn('step mt-8 mb-4 scroll-m-20 tracking-tight', className)}
    {...props}
  />
)

const Steps = ({ ...props }: React.ComponentProps<'div'>) => (
  <div className="mb-12 ml-4 border-l pl-8 [counter-reset:step]" {...props} />
)

export { Step, Steps }
