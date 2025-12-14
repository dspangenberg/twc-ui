import type * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Dialog } from './dialog'
import { PdfContainer } from './pdf-container'
import { useState } from 'react'

interface PdfViewerComponentProps {
  file: string
  filename?: string,
  onCancel: () => void
}

const PdfViewerComponent: React.FC<PdfViewerComponentProps> = ({
  file,
  filename,
  onCancel
}) => {

  const [title, setTitle] = useState<string | undefined>(filename)

  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100"
      width="3xl"
      bodyClass="aspect-210/297 w-3x bg-accent"
      confirmClose={false}
      role="dialog"
      background="accent"
      dismissible={true}
      title={title}
    >
      <PdfContainer
        className="rounded-none! h-full"
        file={file}
        filename={filename}
        hideFilename
        onFilenameChange={value => setTitle(value)}/>
    </Dialog>
  )
}

interface PdfViewerCallParams {
  file: string
  filename?: string,
}

export const PdfViewer = {
  call: (params: PdfViewerCallParams): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      root.render(
        <PdfViewerComponent
          {...params}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )
    })
  },

  Root: () => null
}
