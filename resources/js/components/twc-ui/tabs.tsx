import { createContext, useContext } from 'react'
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  type Key
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/utils'

const tabsStyles = tv({
  slots: {
    base: '',
    list: 'flex',
    tab: 'disabled:text-muted-foreground cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:font-medium',
    panel: 'my-2'
  },
  variants: {
    variant: {
      underlined: {
        list: 'w-full gap-4',
        tab: 'data-[selected]:border-primary data-[hovered]:text-foreground data-[selected]:text-foreground border-b-2 border-transparent py-1'
      },
      default: {
        list: 'bg-muted w-fit rounded-lg p-1',
        tab: 'data-[selected]:bg-background data-[selected]:text-foreground rounded-md px-3 py-1 data-[selected]:shadow'
      },
      classic: {
        list: 'border-border w-full rounded-none border-b',
        tab: 'data-[selected]:border-border data-[selected]:border-b-background data-[selected]:bg-background rounded-none border border-b-0 border-transparent px-4 py-2 data-[selected]:-mb-px data-[selected]:rounded-t-md'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

type TabsContextType = {
  variant: 'underlined' | 'classic' | 'default' | null | undefined
  tabClassName?: string
  panelClassName?: string
}

const TabsContext = createContext<TabsContextType>({
  variant: 'default',
  tabClassName: '',
  panelClassName: ''
})

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component')
  }
  return context
}

export interface TabsProps
  extends Omit<AriaTabsProps, 'onSelectionChange'>,
    VariantProps<typeof tabsStyles> {
  className?: string
  tabClassName?: string
  panelClassName?: string
  onSelectionChange?: (key: Key) => void
}

export const Tabs = ({
  className,
  variant = 'default',
  onSelectionChange,
  tabClassName = '',
  panelClassName = '',
  children,
  ...props
}: TabsProps) => {
  const styles = tabsStyles({ variant })

  return (
    <TabsContext.Provider value={{ variant, tabClassName, panelClassName }}>
      <AriaTabs
        className={styles.base({ className })}
        onSelectionChange={onSelectionChange}
        {...props}
      >
        {children}
      </AriaTabs>
    </TabsContext.Provider>
  )
}

export interface TabListProps<T extends object = object> extends AriaTabListProps<T> {
  className?: string
}

export function TabList<T extends object = object>({ className, ...props }: TabListProps<T>) {
  const { variant } = useTabsContext()
  const styles = tabsStyles({ variant: variant ?? 'default' })

  return <AriaTabList<T> className={styles.list({ className })} {...props} />
}

export interface TabProps extends AriaTabProps {
  className?: string
  href?: string
}

export const Tab = ({ className, ...props }: TabProps) => {
  const { variant, tabClassName } = useTabsContext()
  const styles = tabsStyles({ variant: variant ?? 'default' })

  return <AriaTab className={styles.tab({ className: cn(tabClassName, className) })} {...props} />
}

export interface TabPanelProps extends AriaTabPanelProps {
  className?: string
}

export const TabPanel = ({ className, ...props }: TabPanelProps) => {
  const { variant, panelClassName } = useTabsContext()
  const styles = tabsStyles({ variant: variant ?? 'default' })
  return (
    <AriaTabPanel
      className={styles.panel({ className: cn(panelClassName, className) })}
      {...props}
    />
  )
}
