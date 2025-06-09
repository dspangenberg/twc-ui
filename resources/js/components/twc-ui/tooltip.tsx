import type React from 'react'
import {
  composeRenderProps,
  OverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode
}

const styles = tv({
  base: 'group rounded-md bg-foreground px-3 py-1.5 text-sm text-white will-change-transform',
  variants: {
    isEntering: {
      true: 'fade-in animate-in duration-200'
    },
    isExiting: {
      true: 'fade-out animate-out duration-150'
    }
  }
})

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      {...props}
      offset={8}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({
          ...renderProps,
          className
        })
      )}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          data-placement={props.placement}
          viewBox="0 0 8 8"
          className="data-[placement=left]:-rotate-90 fill-bg-foreground stroke-primary data-[placement=bottom]:rotate-180 data-[placement=right]:rotate-90 forced-colors:fill-[Canvas]"
        >
          <title>Tooltip-Arrow</title>
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  )
}

export { TooltipTrigger }
