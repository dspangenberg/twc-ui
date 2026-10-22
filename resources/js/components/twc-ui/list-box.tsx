import { Check } from 'lucide-react'
import {
  Collection as AriaCollection,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  Section as AriaSection,
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
          'group bg-popover text-popover-foreground overflow-auto rounded-md border p-1 shadow-md outline-none',
          /* Empty */
          'data-empty:p-6 data-empty:text-center data-empty:text-sm'
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
  onDoubleClick,
  ...props
}: Omit<AriaListBoxItemProps<T>, 'id'> & { id?: string | number; onDoubleClick?: () => void }) => {
  return (
    <AriaListBoxItem
      textValue={props.textValue}
      id={id}
      onDoubleClick={onDoubleClick}
      className={composeRenderProps(className, className =>
        cn(
          'pointer-events-auto relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
          /* Disabled */
          'data-disabled:pointer-events-none data-disabled:opacity-50',
          /* Focused */
          'data-focused:bg-accent data-focused:text-accent-foreground',
          /* Hovered */
          'data-hovered:bg-accent data-hovered:text-accent-foreground',
          /* Selection */
          'data-selection-mode:pl-8',
          className
        )
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {renderProps.isSelected && (
            <span className="absolute left-2 flex size-4 items-center justify-center">
              <Check className="text-primary size-4" />
            </span>
          )}
          {children}
        </>
      ))}
    </AriaListBoxItem>
  )
}

function ListBoxHeader({ className, ...props }: React.ComponentProps<typeof AriaHeader>) {
  return <AriaHeader className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
}

export { ListBox, ListBoxItem, ListBoxHeader, ListBoxSection, ListBoxCollection }
