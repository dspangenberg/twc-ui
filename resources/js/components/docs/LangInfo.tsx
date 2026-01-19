import { LanguageSkillIcon } from '@hugeicons/core-free-icons'
import { Pressable } from 'react-aria-components'
import Flag from 'react-flagpack'
import { Icon } from '../twc-ui/icon'
import { Popover, PopoverTrigger } from '../twc-ui/popover'

type CalloutProps = {
  de: string
  en: string[]
}

export const LangInfo = ({ de, en }: CalloutProps) => {
  // Types alphabetisch sortieren

  return (
    <div className="flex items-center gap-1">
      <span className="px-1 font-mono">DE/EN</span>
      <PopoverTrigger>
        <Pressable>
          <Icon role="button" icon={LanguageSkillIcon} className="size-4 cursor-help" />
        </Pressable>
        <Popover>
          <ul className="p-4 font-mono text-sm">
            <li className="flex items-center gap-1">
              <Flag code="GB-UKM" size="s" /> {en}
            </li>
            <li className="flex items-center gap-1">
              <Flag code="DE" size="s" /> {de}
            </li>
          </ul>
        </Popover>
      </PopoverTrigger>
    </div>
  )
}
