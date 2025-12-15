import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'

export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg gap-4">
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
