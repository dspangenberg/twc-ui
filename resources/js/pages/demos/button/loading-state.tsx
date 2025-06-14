import { DemoContainer } from '@/components/docs/DemoContainer'
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
    <DemoContainer className="gap-4">
      <Button
        loading={isLoading}
        icon={PrinterIcon}
        onClick={showLoading}
        title="Print"
      />
      <Button
        loading={isLoading}
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
