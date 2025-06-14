import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { cn } from '@/lib/utils'
import type React from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SourceCode } from './SourceCode'
import { LogoSpinner } from '@/components/twc-ui/logo-spinner'

interface DemoCodePreviewProps {
  codePath: string
  demoPath?: string
  children?: React.ReactNode
  disableCode?: boolean
  title?: string
  isComponent?: boolean
  fileName?: string
}

export const DemoCodePreview: React.FC<DemoCodePreviewProps> = ({
  codePath,
  demoPath,
  title,
  disableCode = false,
  fileName,
  children
}) => {

  const [isLoading, setIsLoading] = useState(true)
  const demoUrl = demoPath?.includes('https') ? demoPath : import.meta.env.VITE_APP_URL + '/' + demoPath

  const codeView = () => {
    return (

      <SourceCode
        codePath={codePath}
        isComponent={!demoPath}
        fileName={fileName}
      />
    )
  }

  if (!demoPath) {
    return codeView()
  }

  return (
    <div className="space-y-3">
      {title && <h3>{title}</h3>}
      {children && (
        <div className="docs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{children as string}</ReactMarkdown>
        </div>
      )}

      <Tabs defaultSelectedKey="preview" className="gap-4 text-sm">
        <TabList>
          <Tab id="preview">Preview</Tab>
          <Tab id="code" isDisabled={disableCode}>Code</Tab>
        </TabList>
        <TabPanel id="preview">
          <div className={cn('relative mb-6 min-h-80 overflow-hidden rounded-md')}>
            <div
              className="absolute inset-0 bg-[length:800px_300px] bg-[url(/dots-bg.png)] bg-repeat opacity-4 dark:opacity-6"
            />
            <div
              className={cn(
                'absolute top-0 bottom-0 flex min-h-80 w-full h-full flex-1 grow items-center justify-center rounded-md border p-6 lg:p-12'
              )}
            >
              {isLoading && (

                <div className=" absolute left-0 right-0">
                  <LogoSpinner className="mx-auto" />
                </div>

              )}
              <iframe
                src={demoUrl}
                className="w-full h-full m-0 p-0 my-auto mx-auto "
                loading="lazy"
                style={{ height: '100%' }}
                onLoad={() => setIsLoading(false)}
              />
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
