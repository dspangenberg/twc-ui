import { cn } from '@/lib/utils'

interface DemoContainerProps {
  children: React.ReactNode
  className?: string
}

export const DemoContainer = ({
  children,
  className
}: DemoContainerProps) => {
  return (
    <div className={cn('flex flex-wrap w-screen justify-center items-center h-screen', className)}>
      {children}
    </div>
  )
}
