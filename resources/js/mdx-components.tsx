import type React from 'react'
import * as runtime from 'react/jsx-runtime'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { DemoCodePreview } from '@/components/docs/DemoCodePreview'
import { InstallationCommand } from '@/components/docs/install-command'
import { InstallationSection } from '@/components/docs/installation-section'
import { Callout } from './components/docs/callout'

const sharedComponents = {
  h2: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'mt-10 scroll-m-16 pb-2 font-medium text-xl sm:text-2xl',
        className
      )}
      {...props}
    />
  ),
  h3: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('mt-8 scroll-m-16 font-medium text-xl', className)} {...props} />
  ),
  h4: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn('mt-6 scroll-m-16 font-medium text-lg', className)} {...props} />
  ),
  code: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative select-all text-nowrap rounded bg-muted px-[6px] py-[3px] font-mono text-[13px]',
        className
      )}
      {...props}
    />
  ),
  p: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('[&:not(:first-child)]:mt-2', className)} {...props} />
  ),
  ul: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('ms-5 mt-3 list-disc', className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }) => (
    <blockquote
      className={`mt-6 border-l-2 pl-6 italic ${className || ''}`}
      {...props}
    />
  ),
  strong: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <strong className={cn('font-medium', className)} {...props} />
  ),
  a: ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      target={href?.toString().includes('https://') ? '_blank' : '_self'}
      href={href}
      className={cn('text-primary hover:underline', className)}
      {...props}
    />
  ),
  table: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded border">
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('border-b last:border-b-0', className)} {...props} />
  ),
  tr: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn('m-0 border-b p-0 last:border-b-0', className)} {...props} />
  ),
  th: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border-e px-4 py-2 text-left font-medium last:border-e-0 [&[align=center]]:text-center [&[align=right]]:text-end',
        className
      )}
      {...props}
    />
  ),
  td: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'text-nowrap border-e px-4 py-2 text-left last:border-e-0 [&[align=center]]:text-center [&[align=right]]:text-end',
        className
      )}
      {...props}
    />
  ),
  // Deine benutzerdefinierten Komponenten
  DemoCodePreview,
  InstallationCommand,
  InstallationSection,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Callout
}

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
}

export const MDXContent = ({ code }: MDXProps) => {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents }} />
}

export { sharedComponents }
