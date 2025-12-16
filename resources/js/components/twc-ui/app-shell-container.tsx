import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useAppShell } from './app-shell-provider'

interface Props<T extends ElementType = 'div'> {
  as?: T
  children: ReactNode
  className?: string
}

export const AppShellContainer = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...rest
}: Props<T> & Omit<ComponentPropsWithoutRef<T>, keyof Props<T>>) => {
  const Component = as || 'div'

  const { classNames } = useAppShell()

  return (
    <Component className={cn(classNames, className)} {...rest}>
      {children}
    </Component>
  )
}
