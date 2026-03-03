import {
  Alert02Icon,
  AlertCircleIcon,
  InformationCircleIcon,
  Rocket02Icon
} from '@hugeicons/core-free-icons'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-lg space-y-4">
      <Alert title="Custom Icon Alert" icon={Rocket02Icon}>
        This alert uses a custom information icon instead of the default variant icon.
      </Alert>

      <Alert variant="destructive" title="Security Alert" icon={Alert02Icon}>
        This alert uses a custom alert icon for security-related messages.
      </Alert>

      <Alert variant="warning" title="Custom Warning" icon={AlertCircleIcon}>
        This alert uses a custom circle icon for warning messages.
      </Alert>

      <Alert title="No Icon Alert" icon={false}>
        This alert has no icon displayed. Use icon={false} to hide the icon completely.
      </Alert>
    </DemoContainer>
  )
}
