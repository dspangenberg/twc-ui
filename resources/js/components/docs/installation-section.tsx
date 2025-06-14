import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
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

    <Tabs defaultSelectedKey="cli" className="mt-6 gap-4">
      <TabList className=" text-sm">
        <Tab id="cli">CLI</Tab>
        <Tab id="copy">Copy + Paste</Tab>
      </TabList>
      <div className="my-3 w-full">
        <TabPanel id="cli">
          {children}
        </TabPanel>
        <TabPanel id="copy">

          <div className="space-y-3 w-full overflow-x-hidden">
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
            <p className="font-medium">Copy and paste the code of
              the {components.length === 1 ? 'component' : 'components'}
            </p>
            <ul className="list-disc list-inside ml-6 my-3">
              {components.map((component) => (
                <li key={component}>{component}.tsx</li>
              ))}
            </ul>
            <p className="font-medium">
              into your project. Don't forget to
              update
              the import
              paths to match your project setup.
            </p>
            <div className="space-y-3 w-full">
              {components.map((component) => (
                <DemoCodePreview key={component} codePath={component} fileName={`${component}.tsx`} />
              ))}
            </div>
          </div>
        </TabPanel>
      </div>
    </Tabs>
  )
}
