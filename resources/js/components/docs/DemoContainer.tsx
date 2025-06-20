import { cn } from '@/lib/utils'

interface DemoContainerProps {
  children: React.ReactNode
  className?: string
}

export const DemoContainer = ({ children, className }: DemoContainerProps) => {
  return (
    <div className={cn('flex h-screen w-screen flex-wrap items-center justify-center', className)}>
      {children}
    </div>
  )
}
