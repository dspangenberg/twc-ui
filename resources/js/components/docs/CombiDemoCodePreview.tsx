import { FullScreenIcon } from '@hugeicons/core-free-icons'
import type React from 'react'
import { useState } from 'react'
import { LogoSpinner } from '@/components/twc-ui/logo-spinner'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { cn } from '@/lib/utils'
import { Button } from '../twc-ui/button'
import { SourceCodeView } from './SourceCodeView'
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

export const CombiDemoCodePreview: React.FC<DemoCodePreviewProps> = ({
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
    return <SourceCodeView hideHeader codePath={codePath} isComponent={!demoPath} type={type} />
  }

  if (!demoPath) {
    return codeView()
  }

  return (
    <div className="">
      <div className="relative">
        <div
          className={cn('relative min-h-80 overflow-hidden rounded-md-t bg-transparent', className)}
        >
          <div className="absolute inset-0 rounded-md" />

          <div
            className={cn(
              'absolute top-0 bottom-0 flex h-full min-h-80 w-full flex-1 grow items-center justify-center rounded-t-md border p-6 lg:p-12'
            )}
          >
            {isLoading && (
              <div className="my-auto">
                <LogoSpinner className="mx-auto" />
              </div>
            )}
            <iframe
              src={demoUrl}
              className="absolute top-0 right-0 left-0 m-0 h-screen w-screen max-w-full rounded-t-md bg-transparent p-0"
              loading="lazy"
              title="Component preview"
              style={{ height: '100%' }}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
        <div>{codeView()}</div>

        <div className="absolute top-1 right-1">
          <Button
            variant="ghost"
            size="icon"
            icon={FullScreenIcon}
            title="Open in new tab"
            onClick={() => window.open(demoUrl, '_blank')}
          />
        </div>
      </div>
    </div>
  )
}
