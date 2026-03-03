import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-md">
      <Alert variant="info" title="Unable to process your payment.">
        <p>Please verify your billing information and try again.</p>
        <ul className="list-inside list-disc">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </Alert>
    </DemoContainer>
  )
}
