import { LinkSquare02Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/twc-ui/icon'
import { cn } from '@/lib/utils'

interface ExtLinkProps {
  className?: string
  title: string
  href: string
}

export const ExtLink = ({ title, href, className }: ExtLinkProps) => {
  const target = href.startsWith('http') ? '_blank' : '_self'
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={cn(
        className,
        'flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 text-foreground'
      )}
    >
      <Icon icon={LinkSquare02Icon} className="size-4" /> {title}
    </a>
  )
}
