import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { cn } from '@/lib/utils'
import type React from 'react'
import { useState } from 'react'
import { SourceCode } from './SourceCode'
import { LogoSpinner } from '@/components/twc-ui/logo-spinner'

export type DemoCodeComponentType = 'component' | 'hook' | 'demo'

interface DemoCodePreviewProps {
  codePath: string
  demoPath?: string
  disableCode?: boolean
  type?: DemoCodeComponentType
  className?: string
  isComponent?: boolean
  fileName?: string
}

export const DemoCodePreview: React.FC<DemoCodePreviewProps> = ({
  codePath,
  demoPath,
  className,
  type = 'demo',
  disableCode = false,
  fileName
}) => {

  const [isLoading, setIsLoading] = useState(true)
  const demoUrl = demoPath?.includes('https')
    ? demoPath
    : `${import.meta.env.VITE_APP_URL.replace(/\/$/, '')}/${demoPath?.replace(/^\//, '')}`
  const codeView = () => {
    return (

      <SourceCode
        codePath={codePath}
        isComponent={!demoPath}
        type={type}
        fileName={fileName}
      />
    )
  }

  if (!demoPath) {
    return codeView()
  }

  return (
    <div className="space-y-3">
      <Tabs defaultSelectedKey="preview" className="gap-4 text-sm">
        <TabList>
          <Tab id="preview">Preview</Tab>
          <Tab id="code" isDisabled={disableCode}>Code</Tab>
        </TabList>
        <TabPanel id="preview">
          <div className={cn('relative mb-6 min-h-80 overflow-hidden rounded-md', className)}>
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
