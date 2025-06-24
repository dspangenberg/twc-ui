import type React from 'react'
import { cn } from '@/lib/utils'

interface FormGroupProps {
  border?: boolean
  cols?: 6 | 12 | 24
  fullWidth?: boolean
  grid?: boolean
  margin?: boolean
  title?: string
  className?: string
  titleClass?: string
  children?: React.ReactNode
}

export const FormGroup: React.FC<FormGroupProps> = ({
  border = false,
  cols = 24,
  fullWidth = true,
  grid = true,
  margin = true,
  title = '',
  className = '',
  titleClass = 'font-medium text-base text-black mt-4 pb-3 border-b',
  children
}) => {
  const gridCols = {
    6: 'grid-cols-6',
    12: 'grid-cols-12',
    24: 'grid-cols-24'
  }[cols]

  return (
    <div className="flex-1 border-accent">
      {title !== '' && <div className={cn('px-4', titleClass)}>{title}</div>}
      <div
        className={cn(
          'mb-1 flex-1 px-4 last:mb-3',
          border || title !== '' ? 'mx-0 border-accent border-t pt-4' : '',
          grid ? 'm-0 grid gap-x-3 gap-y-6 px-4 py-2' : '',
          margin ? 'mt-3' : 'not-first:mt-2',
          grid ? gridCols : '',
          fullWidth ? 'w-full' : '',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
