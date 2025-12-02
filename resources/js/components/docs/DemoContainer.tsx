import { cn } from '@/lib/utils'
import type React from 'react'

interface DemoContainerProps {
  children: React.ReactNode
  className?: string
}

export const DemoContainer = ({ children, className }: DemoContainerProps) => {
  return (
    <div
      className={cn(
        'flex relative h-screen w-screen bg-transparent px-md flex-wrap items-center justify-center',
        className
      )}
    > 
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-1 bg-gray-100 text-xs text-black px-2 rounded font-mono">
        <span className="sm:hidden">xs</span>
        <span className="hidden sm:inline md:hidden">sm</span>
        <span className="hidden md:inline lg:hidden">md</span>
        <span className="hidden lg:inline xl:hidden">lg</span>
        <span className="hidden xl:inline 2xl:hidden">xl</span>
        <span className="hidden 2xl:inline 3xl:hidden">2xl</span>
        <span className="hidden 3xl:inline ">3xl</span>
      </div>
    </div>
  )
}
