import React, { useEffect } from 'react'
import { InstallationCommand } from '@/components/docs/install-command'
import { registryMapping } from '@/components/docs/registry-mapping'
import { SourceCodeBlock } from '@/components/docs/SourceCodeBlock'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'

interface InstallationProps {
  registry: string
}

interface RegistryFile {
  target: string
  type: string
  path: string
}
interface Registry {
  title: string
  dependencies: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}

const mainUrl = import.meta.env.VITE_APP_URL

export const Installation: React.FC<InstallationProps> = ({ registry }) => {
  const [dependenciesList, setDependenciesList] = React.useState<string[]>([])
  const [devDependenciesList, setDevDependenciesList] = React.useState<string[]>([])
  const [componentName, setComponentName] = React.useState('')
  const [registryComponents, setRegistryComponents] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<RegistryFile[]>([])
  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const response = await fetch(`${mainUrl}/r/${registry}.json`)
        // TODO: handle response data
        const json = await response.json()
        setDependenciesList(json.dependencies ?? [])
        setDevDependenciesList(json.devDependencies ?? [])
        setComponentName(json.title)
        setRegistryComponents(json.registryDependencies ?? [])
        setFiles(json.files ?? [])
      } catch (error) {
        console.error('Failed to fetch registry:', error)
      }
    }
    fetchRegistry()
  }, [registry])

  const getRegistrMapping = (alias: string) => {
    const item = registryMapping.find(item => item.alias === alias)
    if (!item) console.log(alias)
    return item
  }

  return (
    <Tabs defaultSelectedKey="cli" className="mt-6 gap-4">
      <TabList className="text-sm">
        <Tab id="cli">CLI</Tab>
        <Tab id="copy">Copy + Paste</Tab>
      </TabList>
      <div className="my-3 w-full">
        <TabPanel id="cli">
          <InstallationCommand command="execute" params={`shadcn@latest add @twc-ui/${registry}`} />
        </TabPanel>
        <TabPanel id="copy">
          <div className="space-y-12">
            <h3>Manual installation</h3>
            <div className="w-full space-y-3 overflow-x-hidden">
              {dependenciesList.length > 0 && (
                <>
                  <h4>Install dependencies</h4>
                  <InstallationCommand command="add" params={`${dependenciesList?.join(' ')}`} />
                </>
              )}
              {devDependenciesList.length > 0 && (
                <>
                  <h4>Install dev-dependencies</h4>
                  <InstallationCommand
                    command="add"
                    params={`-D ${devDependenciesList?.join(' ')}`}
                  />
                </>
              )}

              {registryComponents.length > 0 && (
                <>
                  <h4>Add the required components to your project</h4>
                  <p>
                    The <span className="font-medium">{componentName}</span> component depends on
                    several other components. Make sure you have them copied into your project:
                  </p>

                  <ul className="my-3 ml-6 list-inside list-disc">
                    {registryComponents.map(item => {
                      const mapping = getRegistrMapping(item)
                      return (
                        mapping?.docPath && (
                          <li key={item}>
                            <a
                              className="font-medium underline hover:text-primary"
                              href={`${mainUrl}${mapping.docPath}`}
                            >
                              {mapping.name}
                            </a>
                          </li>
                        )
                      )
                    })}
                  </ul>
                </>
              )}

              <h4>Copy + Paste the following file{files.length > 1 ? 's' : ''}</h4>
              {files.map((file: RegistryFile, index) => (
                <SourceCodeBlock
                  key={index}
                  target={file.target}
                  path={file.path}
                  type={file.type}
                />
              ))}

              <p className="font-medium">
                Don't forget to update the import paths to match your project setup.
              </p>
            </div>
          </div>
        </TabPanel>
      </div>
    </Tabs>
  )
}
