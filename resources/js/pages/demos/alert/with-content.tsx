import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-lg space-y-4">
      <Alert title="Payment Processed Successfully">
        Your payment has been processed and your order is confirmed.
      </Alert>

      <Alert variant="destructive" title="Payment Failed" icon={AlertCircleIcon}>
        <p>We were unable to process your payment. Please check the following:</p>
        <ul className="mt-2 ml-4 list-inside list-disc">
          <li>Card number and CVV are correct</li>
          <li>Billing address matches your card</li>
          <li>Sufficient funds are available</li>
        </ul>
        <p className="mt-2">Contact your bank if the issue persists.</p>
      </Alert>

      <Alert variant="info" title="New Features Available">
        <p>We've added exciting new features to enhance your experience:</p>
        <ul className="mt-2 ml-4 list-inside list-disc">
          <li>Dark mode support for better visibility</li>
          <li>Enhanced search with filters</li>
          <li>Real-time collaboration tools</li>
        </ul>
      </Alert>
    </DemoContainer>
  )
}
