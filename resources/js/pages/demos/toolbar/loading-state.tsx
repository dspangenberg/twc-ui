import { PrinterIcon } from '@hugeicons/core-free-icons'
import { useState } from 'react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'

export const LoadingStateDemo = () => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <DemoContainer className="gap-4">
      <Button isLoading={isLoading} icon={PrinterIcon} onClick={showLoading} title="Print" />
      <Button
        isLoading={isLoading}
        icon={PrinterIcon}
        size="icon"
        variant="outline"
        onClick={showLoading}
        title="Print"
      />
    </DemoContainer>
  )
}

export default LoadingStateDemo
