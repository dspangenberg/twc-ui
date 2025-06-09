import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface DemoCodePreviewProps {
  code: string
  demo: React.ReactNode
  children: React.ReactNode
  title?: string
  fileName?: string
}

export const DemoCodePreview: React.FC<DemoCodePreviewProps> = ({
  code,
  demo,
  title,
  fileName,
  children
}) => {
  const [html, setHtml] = useState<string>('')

  const generateHtml = useCallback(async () => {
    try {
      const generatedHtml = await codeToHtml(code, {
        lang: 'typescript',
        theme: 'github-light'
      })
      setHtml(generatedHtml)
    } catch (error) {
      console.error('Fehler beim Generieren des HTML:', error)
      setHtml('')
    }
  }, [code])

  useEffect(() => {
    generateHtml()
  }, [generateHtml])

  return (
    <div className="mx-auto w-full max-w-4xl ">
      {title && <h2 className="font-bold text-xl">{title}</h2>}
      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children as string}</ReactMarkdown>
      </div>

      <Tabs defaultValue="preview" className="mx-auto w-full max-w-4xl gap-4 mt-6">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className={cn('relative mb-6 min-h-80 overflow-hidden rounded-md')}>
            <div className="absolute inset-0 bg-[length:800px_300px] bg-[url(/dots-bg.png)] bg-repeat opacity-4 dark:opacity-6" />
            <div
              className={cn(
                'relative flex min-h-80 w-full flex-1 grow items-center justify-center rounded-md border p-6 lg:p-12'
              )}
            >
              {demo}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="w-full rounded-md border bg-muted text-sm">
            <div className="font-mono px-4 py-2 font-medium">{fileName}</div>
            <div className="rounded-md bg-muted">
              <div
                className={cn(
                  'text-sm [&>.shiki]:max-h-80 [&>.shiki]:overflow-auto [&>.shiki]:rounded-b-md [&>.shiki]:bg-muted [&>.shiki]:p-4'
                )}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
