import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'
import { Button } from '@/components/twc-ui/button'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-lg space-y-6">
      <Alert
        variant="warning"
        actions={
          <div className="flex gap-2">
            <Button variant="link" size="auto" className="text-warning-foreground" title="Resend" />
            <Button variant="link" size="auto" className="text-warning-foreground" title="Undo" />
          </div>
        }
      >
        Please confirm your new email address.
      </Alert>
    </DemoContainer>
  )
}
