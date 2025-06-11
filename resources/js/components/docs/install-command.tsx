'use client'

import React, { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ClipboardButton } from '@/components/docs/clipboard-button'

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
  params: rawParams,
  wrapperClassname
}: {
  command: BaseCommand
  params: string
  className?: string
  wrapperClassname?: string
}) => {
  const [code, setCode] = useState<string>('')
  const [selectedPackageManager, setSelectedPackageManager] = useState<PackageManager>('pnpm')
  const [params, setParams] = useState<string>(rawParams.replace('~website/', import.meta.env.VITE_APP_URL + '/'))
  const [command, setCommand] = useState<string>('')

  useEffect(() => {
    const packageLevelCommand = getCommandAsPackageManager(baseCommand, selectedPackageManager)
    setCommand(packageLevelCommand + ' ' + params)
  })

  const handlePackageManagerChange = (manager: PackageManager) => {
    const newCommand = getCommandAsPackageManager(baseCommand, manager)
    console.log(newCommand)
    setCommand(newCommand + ' ' + params)
    setSelectedPackageManager(manager)
  }

  useEffect(() => {
    codeToHtml(command, {
      lang: 'bash',
      theme: 'github-light'
    }).then(setCode)
  }, [command])

  return (
    <div className={cn('relative', wrapperClassname)}>
      <div className="w-full rounded-md border bg-muted text-sm p-1.5">
        <div className="flex items-center px-4 pb-1">
          <ToggleGroup
            type="single"
            value={selectedPackageManager}
            className="flex-1"
            onValueChange={handlePackageManagerChange}
          >
            <ToggleGroupItem value="pnpm">pnpm</ToggleGroupItem>
            <ToggleGroupItem value="npm">npm</ToggleGroupItem>
            <ToggleGroupItem value="bun">bun</ToggleGroupItem>
            <ToggleGroupItem value="yarn">yarn</ToggleGroupItem>
          </ToggleGroup>
          <ClipboardButton code={command} />
        </div>
        <div
          className={cn('select-all overflow-hidden rounded text-sm rounded-md [&>.shiki]:p-4', className)}
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </div>
    </div>
  )
}
