import React, { type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { BreadcrumbProp } from './app-shell-breadcrumbs'

const createContext = React.createContext

export type Container = '6xl' | '7xl' | 'full' | '8xl' | '9xl'
export type BackgroundColor =
  | 'bg-background'
  | 'bg-page-content'
  | 'bg-sidebar-content'
  | 'bg-sidebar-accent'

type AppShellProviderProps = {
  children: ReactNode
  width: Container
  backgroundColor?: BackgroundColor
}

type AppShellProviderState = {
  classNames: string
  backgroundClass: string
  width: Container
  backgroundColor?: BackgroundColor
  setWidth: (width: Container) => void
  setBackgroundColor: (bg: BackgroundColor) => void
  breadcrumbs: BreadcrumbProp[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbProp[]) => void
  addBreadcrumb: (breadcrumb: BreadcrumbProp) => void
  removeBreadcrumb: (index: number) => void
  clearBreadcrumbs: () => void
}

const initialState: AppShellProviderState = {
  breadcrumbs: [],
  classNames: '',
  backgroundClass: '',
  width: '7xl',
  backgroundColor: 'bg-page-content',
  setWidth: () => null,
  setBackgroundColor: () => null,
  setBreadcrumbs: () => null,
  addBreadcrumb: () => null,
  removeBreadcrumb: () => null,
  clearBreadcrumbs: () => null
}

const AppShellContext = createContext<AppShellProviderState>(initialState)

export const AppShellProvider = ({
  children,
  width: initialWidth,
  backgroundColor: initialBackgroundColor = 'bg-page-content',
  ...props
}: AppShellProviderProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbProp[]>([])
  const [width, setWidth] = useState<Container>(initialWidth)
  const [classNames, setClassNames] = useState<string>('')
  const [backgroundClass, setBackgroundClass] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(initialBackgroundColor)

  const getClassNames = (width: Container): string => {
    return {
      full: 'max-w-full mx-4',
      '6xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-6xl',
      '7xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-7xl',
      '8xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-8xl',
      '9xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-9xl'
    }[width]
  }

  const getBackgroundClass = (backgroundColor: BackgroundColor): string => {
    return {
      'bg-background': 'bg-background',
      'bg-page-content': 'bg-page-content',
      'bg-sidebar-content': 'bg-sidebar-content',
      'bg-sidebar-accent': 'bg-sidebar-accent'
    }[backgroundColor]
  }

  useEffect(() => {
    setClassNames(getClassNames(width))
    setBackgroundClass(getBackgroundClass(backgroundColor))
  }, [width, backgroundColor])
  const addBreadcrumb = useCallback((breadcrumb: BreadcrumbProp) => {
    setBreadcrumbs(prev => [...prev, breadcrumb])
  }, [])

  const removeBreadcrumb = useCallback((index: number) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([])
  }, [])

  const value = useMemo(
    () => ({
      breadcrumbs,
      setBreadcrumbs,
      addBreadcrumb,
      removeBreadcrumb,
      clearBreadcrumbs,
      width,
      backgroundColor,
      classNames,
      backgroundClass,
      setWidth: (newWidth: Container) => {
        setWidth(newWidth)
      },
      setBackgroundColor: (newBackgroundColor: BackgroundColor) => {
        setBackgroundColor(newBackgroundColor)
      }
    }),
    [
      breadcrumbs,
      addBreadcrumb,
      removeBreadcrumb,
      clearBreadcrumbs,
      width,
      backgroundColor,
      classNames,
      backgroundClass
    ]
  )

  return (
    <AppShellContext.Provider value={value} {...props}>
      {children}
    </AppShellContext.Provider>
  )
}

export const useAppShell = (): AppShellProviderState => {
  const context = useContext(AppShellContext)
  if (context === undefined) {
    throw new Error('useAppShell must be used within a AppShellProvider')
  }
  return context
}
