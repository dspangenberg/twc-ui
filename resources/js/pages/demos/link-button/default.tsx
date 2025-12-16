import { DemoContainer } from '@/components/docs/DemoContainer'
import { LinkButton } from '@/components/twc-ui/link-button'

export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg gap-4">
      <LinkButton href="#" title="Default" />
      <LinkButton href="#" variant="secondary" title="Secondary" />
      <LinkButton href="#" variant="outline" title="Outline" />
      <LinkButton href="#" variant="destructive" title="Destructive" />
      <LinkButton href="#" variant="ghost" title="Ghost" />
      <LinkButton href="#" variant="link" title="Link" />
    </DemoContainer>
  )
}

export default Demo
