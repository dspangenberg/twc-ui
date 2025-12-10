import { DemoContainer } from '@/components/docs/DemoContainer'
import { PdfContainer } from '@/components/twc-ui/pdf-container'
// NODE_TLS_REJECT_UNAUTHORIZED=0
export const Demo = () => {
  return (
    <DemoContainer className="w-max-lg gap-4">
      <PdfContainer file="/compressed.tracemonkey-pldi-09.pdf" />
    </DemoContainer>
  )
}

export default Demo
