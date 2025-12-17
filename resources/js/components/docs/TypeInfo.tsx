import { InformationCircleIcon } from '@hugeicons/core-free-icons'
import { Pressable } from 'react-aria-components'
import { Icon } from '../twc-ui/icon'
import { Popover, PopoverTrigger } from '../twc-ui/popover'

type CalloutProps = {
  title: string
  types: string[]
}

export const TypeInfo = ({ title, types }: CalloutProps) => {
  // Types alphabetisch sortieren
  const sortedTypes = [...types].sort((a, b) => a.localeCompare(b))

  return (
    <div className="flex items-center gap-1">
      <span className="bg-muted px-1 font-mono">{title}</span>
      <PopoverTrigger>
        <Pressable>
          <Icon role="button" icon={InformationCircleIcon} className="size-4 cursor-help" />
        </Pressable>
        <Popover>
          <ul className="p-4 font-mono text-sm">
            {sortedTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </Popover>
      </PopoverTrigger>
    </div>
  )
}
