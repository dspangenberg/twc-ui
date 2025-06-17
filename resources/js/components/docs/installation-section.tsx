import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import type React from 'react'
import { InstallationCommand } from '@/components/docs/install-command'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'

interface DemoCodePreviewProps {
  children: React.ReactNode
  copyAndPaste?: React.ReactNode
  dependencies?: string[]
  devDependencies?: string[]
  hooks: string[]
  components: string[]
}

export const InstallationSection: React.FC<DemoCodePreviewProps> = ({
  children,
  components = [],
  dependencies = [],
  devDependencies = [],
  hooks = []
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
            {devDependencies.length > 0 && (
              <>
                <h4>Install dev-dependencies</h4>
                <InstallationCommand command="add" params={`-D ${devDependencies?.join(' ')}`} />
              </>
            )}

            <h4>Copy + Paste</h4>

            {hooks.length > 0 && <div>
              <h5>{hooks.length === 1 ? 'Hook' : 'Hooks'}</h5>

              <p>Copy and paste the code of
                the {hooks.length === 1 ? 'hook' : 'hooks'}
              </p>
              <ul className="list-disc list-inside ml-6 my-3">
                {hooks.map((hook) => (
                  <li key={hook}>{hook}</li>
                ))}
              </ul>
              <p>
                into your project.
              </p>


              <div className="space-y-3 w-full">
                {hooks.map((hook) => (
                  <DemoCodePreview key={hook} codePath={`${hook}`} type="hook" fileName={`${hook}`} />
                ))}
              </div>
            </div>
            }

            <h5>{components.length === 1 ? 'Component' : 'Components'}</h5>

            <p>Copy and paste the code of
              the {components.length === 1 ? 'component' : 'components'}
            </p>
            <ul className="list-disc list-inside ml-6 my-3">
              {components.map((component) => (
                <li key={component}>{component}.tsx</li>
              ))}
            </ul>

            <div className="space-y-3 w-full">
              {components.map((component) => (
                <DemoCodePreview key={component} type="component" codePath={component} fileName={`${component}.tsx`} />
              ))}
            </div>

            <p className="font-medium">
              Don't forget to update the import paths to match your project setup.
            </p>

          </div>
        </TabPanel>
      </div>
    </Tabs>
  )
}
