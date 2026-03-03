import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-md">
      <Alert icon={AlertCircleIcon} variant="default" title="Payment successful">
        <p>
          Your payment payment has been successfully processed. We have sent you a receipt via
          email.
        </p>
        <ul className="list-inside list-disc">
          <li>Check your email for receipt</li>
          <li>Download invoice if needed</li>
          <li>Save for your records</li>
        </ul>
      </Alert>
    </DemoContainer>
  )
}
