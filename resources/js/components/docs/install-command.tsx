'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SourceCode } from '@/components/docs/SourceCode'
import { Tab, TabList, Tabs } from '@/components/twc-ui/tabs'
import { Key } from 'react-aria-components'

export type PackageManager = 'npm' | 'yarn' | 'bun' | 'pnpm'
export type BaseCommand = 'add' | 'execute' | 'create'

const addCommands: Record<PackageManager, string> = {
  npm: 'npm install',
  yarn: 'yarn add',
  bun: 'bun add',
  pnpm: 'pnpm add'
}

const executeCommands: Record<PackageManager, string> = {
  npm: 'npx',
  yarn: 'npx',
  pnpm: 'pnpm dlx',
  bun: 'bunx --bun'
}

const createCommands: Record<PackageManager, string> = {
  npm: 'npm create',
  yarn: 'yarn create',
  pnpm: 'pnpm create',
  bun: 'bun create'
}

export const getCommandAsPackageManager = (baseCommand: BaseCommand, manager: PackageManager) => {
  switch (baseCommand) {
    case 'add':
      return addCommands[manager]
    case 'execute':
      return executeCommands[manager]
    case 'create':
      return createCommands[manager]
  }

}

export const InstallationCommand = ({
  command: baseCommand,
  className,
  params: rawParams
}: {
  command: BaseCommand
  params: string
  className?: string
}) => {
  const [selectedPackageManager, setSelectedPackageManager] = useState<PackageManager>('pnpm')
  const [params, _setParams] = useState<string>(rawParams.replace('~website/', import.meta.env.VITE_APP_URL + '/'))
  const [command, setCommand] = useState<string>('')

  useEffect(() => {
    const packageLevelCommand = getCommandAsPackageManager(baseCommand, selectedPackageManager)
    setCommand(packageLevelCommand + ' ' + params)
  })

  const handlePackageManagerChange = (key: Key) => {
    const manager = key as PackageManager
    if (['npm', 'yarn', 'bun', 'pnpm'].includes(manager)) {
      const newCommand = getCommandAsPackageManager(baseCommand, manager)
      setCommand(newCommand + ' ' + params)
      setSelectedPackageManager(manager)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <SourceCode
        code={command}
        language="bash"
        header={
          <div className="flex items-center flex-1 px-4 pt-1">
            <Tabs
              selectedKey={selectedPackageManager}
              onSelectionChange={handlePackageManagerChange}
              variant="underlined"
            >
              <TabList className="border-0">
                <Tab id="pnpm">pnpm</Tab>
                <Tab id="npm">npm</Tab>
                <Tab id="bun">bun</Tab>
                <Tab id="yarn">yarn</Tab>
              </TabList>
            </Tabs>
          </div>
        }
      />
    </div>
  )

}
