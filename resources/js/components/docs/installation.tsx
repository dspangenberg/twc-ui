import React, { useEffect } from 'react'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'
import { InstallationCommand } from '@/components/docs/install-command'
import { SourceCodeBlock } from '@/components/docs/SourceCodeBlock'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'

interface DemoCodePreviewProps {
  registry: string
  devDependencies?: string[]
  libs?: string[]
  hooks: string[]
  components: string[]
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

interface RegistryMapping {
  alias: string
  name: string
  docPath: string
}

const registryMapping: RegistryMapping[] = [
  {
    alias: '@twc-ui/alert-dialog',
    name: 'AlertDialog',
    docPath: '/docs/components/alert-dialog'
  },
  {
    alias: '@twc-ui/button',
    name: 'Button',
    docPath: '/docs/components/button'
  },
  {
    alias: '@twc-ui/dialog',
    name: 'Dialog',
    docPath: '/docs/components/dialog'
  },
  {
    alias: '@twc-ui/dropdown-button',
    name: 'DropdownButton',
    docPath: '/docs/components/dropdown-button'
  },
  {
    alias: '@twc-ui/calendar',
    name: 'Calendar',
    docPath: '/docs/components/calendar'
  },
  {
    alias: '@twc-ui/field',
    name: 'Field',
    docPath: '/docs/components/field'
  },
  {
    alias: '@twc-ui/form',
    name: 'Form',
    docPath: '/docs/components/form'
  },
  {
    alias: '@twc-ui/form-errors',
    name: 'FormErrors',
    docPath: '/docs/components/form-errors'
  },
  {
    alias: '@twc-ui/icon',
    name: 'Icon',
    docPath: '/docs/components/icon'
  },
  {
    alias: '@twc-ui/list-box',
    name: 'ListBox',
    docPath: '/docs/components/list-box'
  },
  {
    alias: '@twc-ui/logo',
    name: 'Logo',
    docPath: '/docs/components/logo'
  },
  {
    alias: '@twc-ui/logo-spinner',
    name: 'LogoSpinner',
    docPath: '/docs/components/logo-spinner'
  },
  {
    alias: '@twc-ui/pdf-container',
    name: 'PdfContainer',
    docPath: '/docs/components/pdf-container'
  },
  {
    alias: '@twc-ui/menu',
    name: 'Menu',
    docPath: '/docs/components/menu'
  },
  {
    alias: '@twc-ui/popover',
    name: 'Popover',
    docPath: '/docs/components/popover'
  },
  {
    alias: '@twc-ui/select',
    name: 'Select',
    docPath: '/docs/components/select'
  },
  {
    alias: '@twc-ui/separator',
    name: 'Separator',
    docPath: '/docs/components/separator'
  },
  {
    alias: '@twc-ui/tooltip',
    name: 'Tooltip',
    docPath: '/docs/components/tooltip'
  },
  {
    alias: '@twc-ui/toggle-button',
    name: 'ToggleButton',
    docPath: '/docs/components/toggle-button'
  },
  {
    alias: '@twc-ui/toggle-button-group',
    name: 'ToggleButtonGroup',
    docPath: '/docs/components/toggle-button-group'
  },
  {
    alias: '@twc-ui/toolbar',
    name: 'Toolbar',
    docPath: '/docs/components/toolbar'
  },
  {
    alias: '@twc-ui/use-file-download',
    name: 'useFileDownload',
    docPath: '/docs/hooks/use-file-download'
  },
  {
    alias: '@twc-ui/use-twc-ui-form',
    name: 'useTwcUiForm',
    docPath: '/docs/hooks/use-twc-ui-form'
  }
]

export const Installation: React.FC<DemoCodePreviewProps> = ({ registry }) => {
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
