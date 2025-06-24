import { Task01Icon, TaskDone01Icon } from '@hugeicons/core-free-icons'
import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/twc-ui/button'
import { copyToClipboard } from '@/lib/docs'

interface ClipboardButtonProps {
  tooltip?: string
  code: string
}

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({
  code,
  tooltip = 'Copy code to clipboard'
}) => {
  const [hasCopied, setHasCopied] = useState(false)

  const copy = async () => {
    setHasCopied(true)

    await copyToClipboard(code)
    setTimeout(() => {
      setHasCopied(false)
    }, 3000)
  }

  if (hasCopied) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        iconClassName="text-green-600"
        icon={TaskDone01Icon}
        onClick={copy}
      />
    )
  }

  return (
    <Button variant="ghost" size="icon-sm" icon={Task01Icon} tooltip={tooltip} onClick={copy} />
  )
}
