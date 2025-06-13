import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { cn } from '@/lib/utils'
import type React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SourceCodeViewer } from './source-code-viewer'

interface DemoCodePreviewProps {
  codePath: string
  demo?: React.ReactNode
  children?: React.ReactNode
  title?: string
  isComponent?: boolean
  fileName?: string
}

export const DemoCodePreview: React.FC<DemoCodePreviewProps> = ({
  codePath,
  demo,
  title,
  fileName,
  children
}) => {

  const codeView = () => {
    return (
      <SourceCodeViewer
        codePath={codePath}
        isComponent={!demo}
        fileName={fileName}
      />
    )
  }

  if (!demo) {
    return codeView()
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-3">
      {title && <h3>{title}</h3>}
      {children && (
        <div className="docs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{children as string}</ReactMarkdown>
        </div>
      )}

      <Tabs defaultSelectedKey="preview" className="mx-auto mt-0 w-full max-w-4xl gap-4">
        <TabList>
          <Tab id="preview">Preview</Tab>
          <Tab id="code">Code</Tab>
        </TabList>
        <TabPanel id="preview">
          <div className={cn('relative mb-6 min-h-80 overflow-hidden rounded-md')}>
            <div
              className="absolute inset-0 bg-[length:800px_300px] bg-[url(/dots-bg.png)] bg-repeat opacity-4 dark:opacity-6"
            />
            <div
              className={cn(
                'relative flex min-h-80 w-full flex-1 grow items-center justify-center rounded-md border p-6 lg:p-12'
              )}
            >
              {demo}
            </div>
          </div>
        </TabPanel>
        <TabPanel id="code">
          {codeView()}
        </TabPanel>
      </Tabs>
    </div>
  )
}
