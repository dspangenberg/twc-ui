import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-lg space-y-4">
      <Alert variant="default" title="Default Alert">
        This is a standard alert with neutral styling.
      </Alert>

      <Alert variant="destructive" title="Error Alert">
        This is a destructive alert for error messages and critical information.
      </Alert>

      <Alert variant="info" title="Information Alert">
        This is an info alert for helpful information and guidance.
      </Alert>

      <Alert variant="warning" title="Warning Alert">
        This is a warning alert for cautionary messages.
      </Alert>

      <Alert variant="success" title="Success Alert">
        This is a success alert for positive feedback and confirmations.
      </Alert>
    </DemoContainer>
  )
}
