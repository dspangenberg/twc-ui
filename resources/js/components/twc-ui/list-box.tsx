import { Check } from 'lucide-react'

import {
  Collection as AriaCollection,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  Section as AriaSection,
  type Key,
  composeRenderProps
} from 'react-aria-components'

import { cn } from '@/lib/utils'

const ListBoxSection = AriaSection

const ListBoxCollection = AriaCollection

function ListBox<T extends object>({ className, ...props }: AriaListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeRenderProps(className, className =>
        cn(
          className,
          'group overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
          /* Empty */
          'data-[empty]:p-6 data-[empty]:text-center data-[empty]:text-sm'
        )
      )}
      {...props}
    />
  )
}

const ListBoxItem = <T extends object>({
  className,
  children,
  id,
  ...props
}: Omit<AriaListBoxItemProps<T>, 'id'> & { id?: Key }) => { // Flexibler Key-Typ
  return (
    <AriaListBoxItem
      textValue={props.textValue || (typeof children === 'string' ? children : undefined)}
      id={id}
      className={composeRenderProps(className, className =>
        cn(
          'pointer-events-auto relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
          /* Disabled */
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          /* Focused */
          'data-[focused]:bg-accent data-[focused]:text-accent-foreground',
          /* Hovered */
          'data-[hovered]:bg-accent data-[hovered]:text-accent-foreground',
          /* Selection */
          'data-[selection-mode]:pl-8',
          className
        )
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {renderProps.isSelected && (
            <span className="absolute left-2 flex size-4 items-center justify-center">
              <Check className="size-4 text-primary" />
            </span>
          )}
          {children}
        </>
      ))}
    </AriaListBoxItem>
  )
}

function ListBoxHeader({ className, ...props }: React.ComponentProps<typeof AriaHeader>) {
  return <AriaHeader className={cn('px-2 py-1.5 font-semibold text-sm', className)} {...props} />
}

export { ListBox, ListBoxItem, ListBoxHeader, ListBoxSection, ListBoxCollection }
