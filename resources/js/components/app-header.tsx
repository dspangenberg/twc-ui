import { Breadcrumbs } from '@/components/breadcrumbs'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem, NavItem, SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import AppLogo from './app-logo'
import AppLogoIcon from './app-logo-icon'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  BlockGameIcon,
  BlueskyIcon,
  BookOpen01Icon,
  GeometricShapes01Icon,
  Github01Icon,
  Home13Icon,
  HugeiconsIcon as HugeIcon,
  JudgeIcon,
  SwatchIcon
} from '@hugeicons/core-free-icons'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'

const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home13Icon
  },
  {
    title: 'Docs',
    href: '/docs',
    icon: BookOpen01Icon
  },
  {
    title: 'Components',
    href: '/docs/button',
    icon: GeometricShapes01Icon
  },
  {
    title: 'Style',
    href: '/style',
    icon: SwatchIcon
  },
  {
    title: 'Blocks',
    href: '/blocks',
    icon: BlockGameIcon
  },
  {
    title: 'Legal',
    href: '/legal',
    icon: JudgeIcon
  }
]

const rightNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/twiceware-cloud/ui',
    icon: Github01Icon
  },
  {
    title: 'Bluesky',
    href: 'https://bsky.app/profile/ui.twiceware.cloud',
    icon: BlueskyIcon
  },
  {
    title: 'HugeIcons (Affiliate)',
    href: 'https://hugeicons.com/?via=daspwork',
    icon: HugeIcon
  }
]

const activeItemStyles =
  'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader ({ breadcrumbs = [] }: AppHeaderProps) {
  const page = usePage<SharedData>()

  return (
    <>
      <div className="border-sidebar-border/80 border-b ">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 h-[34px] w-[34px]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
              >
                <SheetTitle className="sr-only">
                  Navigation Menu
                </SheetTitle>
                <SheetHeader className="flex justify-start text-left">
                  <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                  <div className="flex h-full flex-col justify-between text-sm">
                    <div className="flex flex-col space-y-4">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center space-x-2 font-medium"
                        >
                          {item.icon && (
                            <HugeiconsIcon
                              icon={item.icon}
                              className="size-5 text-foreground/80"
                            />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-4">
                      {rightNavItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 font-medium"
                        >
                          {item.icon && (
                            <HugeiconsIcon
                              icon={item.icon}
                              className="size-5 text-foreground/80"
                            />
                          )}
                          <span>{item.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            prefetch
            className="flex items-center w-32 space-x-2"
          >
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="ml-6 hidden h-full w-full items-center space-x-6 lg:flex">
            <NavigationMenu className="mx-auto flex h-full flex-1 items-stretch">
              <NavigationMenuList className="flex h-full items-stretch justify-center space-x-2">
                {mainNavItems.map((item, index) => (
                  <NavigationMenuItem
                    key={index}
                    className="relative flex h-full items-center"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        page.url === item.href &&
                        activeItemStyles,
                        'h-9 cursor-pointer px-3'
                      )}
                    >
                      {item.icon && (
                        <HugeiconsIcon
                          icon={item.icon}
                          className="mr-2 size-5"
                        />
                      )}
                      {item.title}
                    </Link>
                    {page.url === item.href && (
                      <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white" />
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
              <div className="hidden lg:flex">
                {rightNavItems.map((item) => (
                  <TooltipProvider
                    key={item.title}
                    delayDuration={0}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 font-medium text-accent-foreground text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                                                    <span className="sr-only">
                                                        {item.title}
                                                    </span>
                          {item.icon && (
                            <HugeiconsIcon
                              icon={item.icon}
                              className="opacity-80 size-5 group-hover:opacity-100"
                            />
                          )}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <AppearanceToggleDropdown />
            </div>
          </div>
        </div>
      </div>
      {breadcrumbs.length > 1 && (
        <div className="flex w-full border-sidebar-border/70 border-b">
          <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  )
}
