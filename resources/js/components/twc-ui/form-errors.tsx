import { Sad01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  errors: Partial<Record<string, string>>
  title?: string
  showErrors?: boolean
}

export const FormErrors: React.FC<Props> = ({
  errors,
  showErrors = true,
  title = 'Oobs! Something went wrong:'
}) => {
  const errorMessages = useMemo(() => {
    if (!errors) return []
    return Object.values(errors)
  }, [errors])

  if (errorMessages.length === 0) {
    return null
  }

  return (
    <>
      <div className="rounded-lg border border-destructive p-4 mx-4 pt-2 mb-6 text-destructive" role="alert">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="flex-none">
              <div
                className={cn('mx-auto flex size-6 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-8 bg-destructive/20')}
              >
                <HugeiconsIcon icon={Sad01Icon} className={cn('size-5 stroke-3 text-destructive')} />
              </div>
            </div>
            <div className="text-base font-medium flex-1">{title}</div>
          </div>
          {showErrors && <div className="grow space-y-1">
            <ul
              className="list-inside list-disc text-sm opacity-80 pl-12 motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md"
            >
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
          }
        </div>
      </div>
    </>
  )
}
