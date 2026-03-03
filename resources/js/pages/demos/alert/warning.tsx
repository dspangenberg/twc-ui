import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-md space-y-4">
      {/* Warning Alert - should show InformationCircleIcon */}
      <Alert variant="warning" title="Unable to process your payment.">
        <p>Please verify your billing information and try again.</p>
      </Alert>

      {/* Info Alert - should show AlertCircleIcon */}
      <Alert variant="info" title="Information message">
        <p>This is an info message with different icon.</p>
      </Alert>
    </DemoContainer>
  )
}
