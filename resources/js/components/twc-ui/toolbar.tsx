import type React from 'react'
import {
  Toolbar as AriaToolbar,
  composeRenderProps,
  type ToolbarProps as AriaToolbarProps
} from 'react-aria-components'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const toolbarVariants = cva('flex gap-1 data-[orientation=vertical]:flex-col', {
  variants: {
    variant: {
      default: '[&>button_svg]:text-primary',
      secondary: '[&>button_svg]:text-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface ToolbarProps
  extends Omit<AriaToolbarProps, 'children'>,
    VariantProps<typeof toolbarVariants> {
  children: React.ReactNode
}

export const Toolbar = ({ variant, ...props }: ToolbarProps) => {
  return (
    <AriaToolbar
      {...props}
      className={composeRenderProps(props.className, className =>
        cn(toolbarVariants({ variant }), className)
      )}
    />
  )
}
