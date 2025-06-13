import { Head } from '@inertiajs/react'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { LayoutContainer } from '@/components/twc-ui/layout-container'
import type { BreadcrumbProp } from '@/components/twc-ui/page-breadcrumbs'
import { type BackgroundColor, type Container, useThemeContainer } from '@/components/twc-ui/layout-container-provider'
import { cn } from '@/lib/utils'
import { useBreadcrumbProvider } from '@/components/twc-ui/breadcrumb-provider'
import { ClassicNavTabs } from '@/components/twc-ui/classic-nav-tabs'

interface PageContainerProps {
  title?: string
  header?: string | React.ReactNode
  children: React.ReactNode
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  tabs?: React.ReactNode
  width?: Container
  breadcrumbs?: BreadcrumbProp[]
  className?: string
  hideHeader?: boolean
  containerBackground?: BackgroundColor
  headerClassname?: string
  bgClassName?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  width = '7xl',
  header,
  toolbar,
  tabs,
  breadcrumbs = null,
  hideHeader = false,
  containerBackground = 'bg-page-content',
  className = '',
  headerClassname = '',
  footer,
  children
}) => {
  const {
    setWidth,
    setBackgroundColor,
    backgroundClass
  } = useThemeContainer()
  const { setBreadcrumbs } = useBreadcrumbProvider()

  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs)
    }
    setBackgroundColor(containerBackground)
    setWidth(width)
  }, [setBreadcrumbs, breadcrumbs, setWidth, width])

  const headerContent = useMemo(() => {
    if (header) {
      return typeof header === 'string' ? (
        <span className="font-bold text-2xl">{header}</span>
      ) : (
        header
      )
    }
    return <span className="font-bold text-2xl">{title}</span>
  }, [header, title])

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-page-content">
      <Head title={title} />

      {!hideHeader && (
        <div className="z-10 flex-none rounded-t-xl border-border/50 border-y bg-background">
          <LayoutContainer className={cn('px-4', tabs ? 'py-0' : '', headerClassname)}>
            <div className="flex flex-1 flex-col">
              <div className={cn('flex flex-1 justify-between ', tabs ? 'pt-3' : 'py-3')}>
                <div className="flex h-fit flex-1 items-stretch py-3">{headerContent}</div>
                {toolbar && (
                  <div className="h-fit flex-none items-end justify-end py-3">{toolbar}</div>
                )}
              </div>

              <div className="flex flex-1 items-center">
                <div>{tabs && <ClassicNavTabs>{tabs}</ClassicNavTabs>}</div>
              </div>
            </div>
          </LayoutContainer>
        </div>
      )}

      <div className={cn('relative flex-1 bg-page-content py-6', backgroundClass)}>
        <LayoutContainer
          className={cn(
            'xl:!flex-row absolute inset-0 my-6 min-h-0 flex-col gap-2 overflow-y-auto px-4',
            className
          )}
        >
          {children}
        </LayoutContainer>
      </div>
      {footer && <LayoutContainer className="w-full">{footer}</LayoutContainer>}
    </div>
  )
}
