import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Rocket02Icon } from '@hugeicons/core-free-icons'
export const Demo = () => {
  return (
    <DemoContainer className="gap-4 w-max-lg">
      <Button title="Default" />
      <Button variant="secondary" title="Secondary" />
      <Button variant="outline" title="Outline" />
      <Button variant="destructive" title="Destructive" />
      <Button variant="ghost" title="Ghost" />
      <Button variant="link" title="Link" />
    </DemoContainer>
  )
}

export default Demo
