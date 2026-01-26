import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { PdfViewer } from '@/components/twc-ui/pdf-viewer'

export const Demo = () => {
  const onOpenPdfClicked = async () => {
    await PdfViewer.call({
      file: '/compressed.tracemonkey-pldi-09.pdf'
    })
  }

  return (
    <DemoContainer className="gap-4">
      <Button variant="outline" title="Open PDF in Viewer" onClick={onOpenPdfClicked} />
    </DemoContainer>
  )
}

export default Demo
