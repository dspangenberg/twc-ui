import { Button } from '@/components/twc-ui/button'
import { Rocket02Icon } from '@hugeicons/core-free-icons'

export const WithIconDemo = () => {
  return (
    <div className="flex gap-4 m-4 flex-wrap">
      <Button variant="default" icon={Rocket02Icon} title="Get started" />
      <Button variant="outline" icon={Rocket02Icon} size="icon" tooltip="Get started" />
    </div>
  )
}
