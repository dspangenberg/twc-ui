import { ChevronDown } from 'lucide-react'
import { Group } from 'react-aria-components'
import { Button, type ButtonProps } from './button'
import { DropdownButton, type DropdownButtonProps } from './dropdown-button'

type SplitButtonProps<T extends object> = Omit<DropdownButtonProps<T>, 'onClick'> & {
  onClick?: ButtonProps['onClick']
}

function SplitButton<T extends object>({
  title,
  children,
  variant,
  placement = 'bottom right',
  selectionMode = undefined,
  selectedKeys = undefined,
  onSelectionChange,
  size = 'default',
  onClick,
  ...props
}: SplitButtonProps<T>) {
  return (
    <Group className="group border-input focus-within:ring-ring/20 flex items-center rounded-md border focus-within:ring-[3px]">
      <Button
        variant={variant}
        size={size}
        icon={props.icon}
        title={title}
        onClick={onClick}
        className="group-hover:border-r-border! rounded-r-none! border-0 border-r focus-visible:ring-0"
      />
      <DropdownButton
        variant="ghost"
        size="icon"
        icon={ChevronDown}
        className="rounded-l-none border-y-0 border-r-0 border-l!"
        iconClassName="size-4"
        placement={placement}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        menuClassName={props.menuClassName}
      >
        {children}
      </DropdownButton>
    </Group>
  )
}

export { SplitButton }
