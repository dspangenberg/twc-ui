import type React from 'react'
import { cn } from '@/lib/utils'

interface DemoContainerProps {
  children: React.ReactNode
  className?: string
}

export const DemoContainer = ({ children, className }: DemoContainerProps) => {
  return (
    <div
      className={cn(
        'relative flex h-screen w-screen flex-wrap items-center justify-center bg-transparent px-md',
        className
      )}
    >
      {children}
      <div className="fixed right-1.5 bottom-1.5 z-50 rounded bg-blue-50 p-1 px-2 font-mono text-black text-xs">
        <span className="sm:hidden">xs</span>
        <span className="hidden sm:inline md:hidden">sm</span>
        <span className="hidden md:inline lg:hidden">md</span>
        <span className="hidden lg:inline xl:hidden">lg</span>
        <span className="hidden xl:inline 2xl:hidden">xl</span>
        <span className="3xl:hidden hidden 2xl:inline">2xl</span>
        <span className="3xl:inline hidden">3xl</span>
      </div>
    </div>
  )
}
