import { Popover, PopoverTrigger } from '../twc-ui/popover'
import { Pressable } from 'react-aria-components'
import { HugeiconsIcon } from '@hugeicons/react'
import { InformationCircleIcon} from '@hugeicons/core-free-icons'
type CalloutProps = {
  title: string
  types: string[]
}

export const TypeInfo = ({ title, types }: CalloutProps) => {
  return (
    <PopoverTrigger>
      <Pressable>
        <span className="font-mono flex items-center gap-1 cursor-help">{title} <HugeiconsIcon icon={InformationCircleIcon} className="size-4"/></span>
      </Pressable>
      <Popover>
        <ul className="font-mono p-4">
          {types.map((type, index) => (
            <li key={index}>
              {type}
            </li>
          ))}
        </ul>
      </Popover>
    </PopoverTrigger>
  )
}
