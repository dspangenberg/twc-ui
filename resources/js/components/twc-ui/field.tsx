import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
  composeRenderProps
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/utils'

const labelVariants = tv({
  base: [
    'text-sm leading-none font-normal',
    /* Disabled */
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
    /* Invalid */
    'group-data-[invalid]:text-destructive'
  ]
})

interface LabelProps extends AriaLabelProps {
  isRequired?: boolean
  value?: string
}

const Label = ({ className, children, value, isRequired = false, ...props }: LabelProps) => {
  const valueWithColon = value ? `${value}:` : ''
  return (
    <AriaLabel className={cn(labelVariants(), className)} {...props}>
      {children ? (
        children
      ) : (
        <span>
          {valueWithColon ?? ''} {isRequired && <span className="text-destructive">*</span>}
        </span>
      )}
    </AriaLabel>
  )
}

function FieldDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
      slot="description"
    />
  )
}

function FieldError({ className, ...props }: AriaFieldErrorProps) {
  return (
    <AriaFieldError
      className={cn('text-destructive text-[0.8rem] font-medium', className)}
      {...props}
    />
  )
}

const fieldGroupVariants = tv({
  variants: {
    variant: {
      default: [
        'border-input bg-background relative flex h-9 w-full items-center overflow-hidden rounded-sm border px-3 py-1 text-base font-medium shadow-none transition-colors',
        /* Focus Within */
        'focus-within:border-primary focus-within:ring-primary/20 focus:border-primary focus-within:ring-[3px]',
        'data-[invalid]:border-destructive data-[invalid]:focus-within:border-destructive data-[invalid]:focus-within:ring-destructive/20',
        /* Disabled */
        'data-[disabled]:opacity-50'
      ],
      ghost: 'data-[invalid]:border-destructive w-full'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface GroupProps extends AriaGroupProps, VariantProps<typeof fieldGroupVariants> {}

function FieldGroup({ className, variant, ...props }: GroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, className =>
        fieldGroupVariants({ variant, className })
      )}
      {...props}
    />
  )
}

export { Label, labelVariants, FieldGroup, fieldGroupVariants, FieldError, FieldDescription }
