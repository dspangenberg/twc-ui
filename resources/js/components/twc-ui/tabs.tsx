import React, { createContext, useContext } from 'react'
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  type TabsProps as AriaTabsProps,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
  type TabPanelProps as AriaTabPanelProps,
  type Key
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'

// Varianten für Tabs definieren
const tabsVariants = cva('', {
  variants: {
    variant: {
      classic: '',
      underlined: '',
      default: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const tabListVariants = cva('flex', {
  variants: {
    variant: {
      underlined: 'flex gap-4',
      default: 'flex bg-muted rounded-lg p-1 w-fit',
      classic: 'w-full p-0 bg-background justify-start border-b rounded-none'
    }
  }
})

const tabVariants = cva(
  'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:text-muted-foreground',
  {
    variants: {
      variant: {
        underlined: 'border-b-2 py-1 border-transparent data-[selected]:border-primary data-[selected]:text-foreground data-[hovered]:text-foreground',
        default: 'font-medium rounded-md px-3 py-1 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow',
        classic: 'px-2 py-1 rounded-none bg-background h-full border border-transparent border-b-border data-[selected]:border-border data-[selected]:border-b-background -mb-[2px] rounded-t-md'
      }
    }
  }
)

// Context für die Variant - erweitert um null und undefined
type TabsContextType = {
  variant: 'underlined' | 'classic' | 'default' | null | undefined
}

const TabsContext = createContext<TabsContextType>({ variant: 'default' })

// Hook für den Context
const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component')
  }
  return context
}

// Tabs Props Interface - Custom onSelectionChange erlauben
export interface TabsProps
  extends Omit<AriaTabsProps, 'onSelectionChange'>,
    VariantProps<typeof tabsVariants> {
  className?: string
  onSelectionChange?: (key: Key) => void
}

// Hauptkomponente Tabs
export const Tabs = ({
  className,
  variant = 'default',
  onSelectionChange,
  children,
  ...props
}: TabsProps) => {
  return (
    <TabsContext.Provider value={{ variant }}>
      <AriaTabs
        className={cn(tabsVariants({ variant }), className)}
        onSelectionChange={onSelectionChange}
        {...props}
      >
        {children}
      </AriaTabs>
    </TabsContext.Provider>
  )
}

// TabList Komponente
export interface TabListProps<T extends object = object> extends AriaTabListProps<T> {
  className?: string
}

export function TabList<T extends object = object> ({
  className,
  ...props
}: TabListProps<T>) {
  const { variant } = useTabsContext()

  return (
    <AriaTabList<T>
      className={cn(tabListVariants({ variant: variant ?? 'default' }), className)}
      {...props}
    />
  )
}

// Tab Komponente
export interface TabProps extends AriaTabProps {
  className?: string
  href?: string // href als optional hinzugefügt
}

export const Tab = ({
  className,
  ...props
}: TabProps) => {
  const { variant } = useTabsContext()

  return (
    <AriaTab
      className={cn(tabVariants({ variant: variant ?? 'default' }), className)}
      {...props}
    />
  )
}

// TabPanel Komponente
export interface TabPanelProps extends AriaTabPanelProps {
  className?: string
}

export const TabPanel = ({
  className,
  ...props
}: TabPanelProps) => {
  return (
    <AriaTabPanel
      className={cn('my-2', className)}
      {...props}
    />
  )
}
