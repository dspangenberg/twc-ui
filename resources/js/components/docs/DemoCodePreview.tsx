import type React from 'react'
import { useState } from 'react'
import { LogoSpinner } from '@/components/twc-ui/logo-spinner'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { cn } from '@/lib/utils'
import { SourceCode } from './SourceCode'
import { Button } from '../twc-ui/button'
import { MaximizeScreenIcon } from '@hugeicons/core-free-icons'
export type DemoCodeComponentType = 'component' | 'hook' | 'demo'

interface DemoCodePreviewProps {
  codePath: string
  demoPath?: string
  disableCode?: boolean
  type?: DemoCodeComponentType
  className?: string
  smHeight?: number
  mdHeight?: number
  lgHeight?: number
}

export const DemoCodePreview: React.FC<DemoCodePreviewProps> = ({
  codePath,
  demoPath,
  className,
  type = 'demo',
  disableCode = false
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const demoUrl = demoPath?.includes('https')
    ? demoPath
    : `${import.meta.env.VITE_APP_URL.replace(/\/$/, '')}/${demoPath?.replace(/^\//, '')}`
  const codeView = () => {
    return <SourceCode codePath={codePath} isComponent={!demoPath} type={type} />
  }

  if (!demoPath) {
    return codeView()
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Tabs defaultSelectedKey="preview" className="gap-4 text-sm">
          <TabList>
            <Tab id="preview">Preview</Tab>
            <Tab id="code" isDisabled={disableCode}>
              Code
            </Tab>
          </TabList>

          <TabPanel id="preview">
            <div
              className={cn(
                'relative mb-6 min-h-80 overflow-hidden rounded-md bg-transparent',
                className
              )}
            >
              <div className="absolute inset-0 bg-[length:800px_300px] bg-[url(/dots-bg.png)] bg-repeat opacity-4 dark:opacity-6 rounded-md" />

              <div
                className={cn(
                  'absolute top-0 bottom-0 flex h-full min-h-80 w-full flex-1 grow items-center justify-center rounded-md border p-6 lg:p-12'
                )}
              >
                {isLoading && (
                  <div className=" absolute right-0 left-0">
                    <LogoSpinner className="mx-auto" />
                  </div>
                )}
                <iframe
                  src={demoUrl}
                  className="m-0 h-screen w-screen p-0 bg-transparent roundedd-md absolute left-0 right-0 max-w-full top-0  w-screen "
                  loading="lazy"
                  style={{ height: '100%' }}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel id="code">{codeView()}</TabPanel>
        </Tabs>
        <div className="absolute top-1 right-0">
          <Button
            variant="ghost"
            size="icon"
            icon={MaximizeScreenIcon}
            title="Open in new tab"
            onClick={() => window.open(demoUrl, '_blank')}
          />
        </div>
      </div>
    </div>
  )
}
