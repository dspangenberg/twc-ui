'use client'

import React from 'react'
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps,
  ToggleButtonGroup as AriaToggleButtonGroup,
  ToggleButtonGroupProps as AriaToggleButtonGroupProps, type TooltipProps
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import { Icon, type IconType } from './icon'
import { toggleButtonVariants } from './toggle-button'
import { Tooltip, TooltipTrigger } from './tooltip'

const ToggleButtonGroupContext = React.createContext<
  VariantProps<typeof toggleButtonVariants> & {
  tooltipPlacement?: TooltipProps['placement']
}
>({
  size: 'default',
  variant: 'default',
  tooltipPlacement: 'bottom'
})

export interface ToggleButtonGroupProps extends AriaToggleButtonGroupProps {
  variant?: 'default' | 'outline' | 'toolbar'
  size?: 'default' | 'sm' | 'lg'
  tooltipPlacement?: TooltipProps['placement']
}

const toggleButtonGroupVariants = tv({
  base: 'group/toggle-button-group flex w-fit items-center rounded-md gap-0.5',
  variants: {
    variant: {
      default: '',
      outline: 'shadow-xs',
      toolbar: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export const ToggleButtonGroup = ({
  className,
  variant = 'default',
  size = 'default',
  tooltipPlacement = 'bottom',
  children,
  ...props
}: ToggleButtonGroupProps) => {
  return (
    <AriaToggleButtonGroup
      {...props}
      data-slot="toggle-button-group"
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (cls) =>
        toggleButtonGroupVariants({
          variant,
          className: cls
        })
      )}
    >
      <ToggleButtonGroupContext.Provider value={{
        variant,
        size,
        tooltipPlacement
      }}
      >
        {children as React.ReactNode}
      </ToggleButtonGroupContext.Provider>
    </AriaToggleButtonGroup>
  )
}

export interface ToggleButtonGroupItemProps extends AriaToggleButtonProps {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  icon: IconType
  tooltip?: string
}

const toggleButtonGroupItemVariants = tv({
  base: 'min-w-0 flex-1 shrink-0 rounded-md shadow-none  focus:z-10 focus-visible:z-10',
  variants: {
    variant: {
      default: '',
      outline: 'border-l-0 first:border-l'
    }
  }
})

export const ToggleButtonGroupItem = ({
  className,
  variant,
  tooltip = '',
  size,
  ...props
}: ToggleButtonGroupItemProps) => {
  const context = React.useContext(ToggleButtonGroupContext)
  const finalVariant = context.variant || variant
  const finalSize = context.size || size
  const finalTooltipPlacement = context.tooltipPlacement || 'bottom'
  const finalTooltip = tooltip || props['aria-label']

  const iconSizeClass = {
    default: 'size-5',
    sm: 'size-5',
    lg: 'size-5'
  }[size || 'default']

  return (
    <TooltipTrigger>
      <AriaToggleButton
        data-slot="toggle-button-group-item"
        data-variant={finalVariant}
        data-size={finalSize}
        {...props}
        className={composeRenderProps(className, (cls, renderProps) =>
          toggleButtonVariants({
            ...renderProps,
            variant: finalVariant as 'default' | 'outline',
            size: finalSize as 'default' | 'sm' | 'lg',
            className: toggleButtonGroupItemVariants({
              variant: finalVariant as 'default' | 'outline',
              className: cls
            })
          })
        )}
      >

        <Icon icon={props.icon} className={iconSizeClass} />


      </AriaToggleButton>
      <Tooltip placement={finalTooltipPlacement}>{finalTooltip}</Tooltip>
    </TooltipTrigger>
  )
}
