import type React from 'react'
import { useEffect } from 'react'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'
import { InstallationCommand } from '@/components/docs/install-command'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'

interface DemoCodePreviewProps {
  component: string
  registry: string
  dependencies?: string[]
  devDependencies?: string[]
  libs?: string[]
  hooks: string[]
  components: string[]
}

export const Installation: React.FC<DemoCodePreviewProps> = ({
  registry,
  components = [],
  dependencies = [],
  libs = [],
  devDependencies = [],
  hooks = []
}) => {
  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const response = await fetch(`https://twc-ui.example/r/${registry}.json`)
        // TODO: handle response data
      } catch (error) {
        console.error('Failed to fetch registry:', error)
      }
    }
    fetchRegistry()
  }, [registry])

  return (
    <Tabs defaultSelectedKey="cli" className="mt-6 gap-4">
      <TabList className="text-sm">
        <Tab id="cli">CLI</Tab>
        <Tab id="copy">Copy + Paste</Tab>
      </TabList>
      <div className="my-3 w-full">
        <TabPanel id="cli">{children}</TabPanel>
        <TabPanel id="copy">
          <div className="w-full space-y-3 overflow-x-hidden">
            {dependencies.length > 0 && (
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

            {hooks.length > 0 && (
              <div>
                <h5>{hooks.length === 1 ? 'Hook' : 'Hooks'}</h5>

                <p>Copy and paste the code of the {hooks.length === 1 ? 'hook' : 'hooks'}</p>
                <ul className="my-3 ml-6 list-inside list-disc">
                  {hooks.map(hook => (
                    <li key={hook}>{hook}</li>
                  ))}
                </ul>
                <p>into your project.</p>

                <div className="w-full space-y-3">
                  {hooks.map(hook => (
                    <DemoCodePreview key={hook} codePath={`${hook}`} type="hook" />
                  ))}
                </div>
              </div>
            )}

            {libs.length > 0 && (
              <div>
                <h5>{libs.length === 1 ? 'Lib' : 'Libs'}</h5>

                <p>Copy and paste the code of the {libs.length === 1 ? 'lib' : 'libs'}</p>
                <ul className="my-3 ml-6 list-inside list-disc">
                  {libs.map(lib => (
                    <li key={lib}>{lib}</li>
                  ))}
                </ul>
                <p>into your project.</p>

                <div className="w-full space-y-3">
                  {libs.map(lib => (
                    <DemoCodePreview key={lib} codePath={`${lib}`} type="lib" />
                  ))}
                </div>
              </div>
            )}

            <h5>{components.length === 1 ? 'Component' : 'Components'}</h5>

            <p>
              Copy and paste the code of the {components.length === 1 ? 'component' : 'components'}
            </p>
            <ul className="my-3 ml-6 list-inside list-disc">
              {components.map(component => (
                <li key={component}>{component}</li>
              ))}
            </ul>

            <div className="w-full space-y-3">
              {components.map(component => (
                <DemoCodePreview key={component} type="component" codePath={component} />
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
