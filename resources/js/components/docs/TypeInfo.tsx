import { HugeiconsIcon } from '@hugeicons/react'
import { InformationCircleIcon } from '@hugeicons/core-free-icons'
import { Pressable } from 'react-aria-components'
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
      <span className="font-mono">{title}</span>
      <PopoverTrigger>
        <Pressable>
          <HugeiconsIcon
            role="button"
            icon={InformationCircleIcon}
            className="size-4 cursor-help"
          />
        </Pressable>
        <Popover>
          <ul className="font-mono p-4 text-sm">
            {sortedTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </Popover>
      </PopoverTrigger>
    </div>
  )
}
