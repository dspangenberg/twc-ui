import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type React from 'react'
import { InstallationCommand } from '@/components/docs/install-command'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'

interface DemoCodePreviewProps {
  children: React.ReactNode
  copyAndPaste?: React.ReactNode
  dependencies?: string[]
  devDependencies?: string[]
  components: string[]
}

export const InstallationSection: React.FC<DemoCodePreviewProps> = ({
  copyAndPaste,
  components,
  dependencies,
  devDependencies,
  children
}) => {

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Tabs defaultValue="cli" className="mx-auto mt-6 w-full max-w-4xl gap-4">
        <TabsList>
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="copy">Copy + Paste</TabsTrigger>
        </TabsList>
        <TabsContent value="cli">
          {children}
        </TabsContent>
        <TabsContent value="copy">
          <div className="space-y-6 ">
            {dependencies && (
              <>
                <h4>Install dependencies</h4>
                <InstallationCommand command="add" params={`${dependencies?.join(' ')}`} />
              </>
            )}
            {devDependencies && (
              <>
                <h4>Install dev-dependencies</h4>
                <InstallationCommand command="add" params={`-D ${devDependencies?.join(' ')}`} />
              </>
            )}

            <h4>Copy + Paste</h4>
            <p className="font-medium">Copy and paste the code of the
              following {components.length === 1 ? 'component' : 'components'} into your project. Don't forget to update
              the import
              paths to match your project setup.</p>
            {components.map((component) => (
              <DemoCodePreview isComponent key={component} codePath={component} fileName={`${component}.tsx`} />
            ))}


            {copyAndPaste}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
