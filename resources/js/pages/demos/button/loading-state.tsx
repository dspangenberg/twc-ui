import { Button } from '@/components/twc-ui/button'
import { PrinterIcon } from '@hugeicons/core-free-icons'
import { useState } from 'react'

export const LoadingStateDemo = () => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <Button
      loading={isLoading}
      variant="outline"
      size="auto"
      icon={PrinterIcon}
      onClick={showLoading}
      title="Print"
    />
  )
}
