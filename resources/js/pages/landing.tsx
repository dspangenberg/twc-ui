import { Rocket02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Head } from '@inertiajs/react'
import { TargetIcon } from 'lucide-react'
import { RevealText } from '@/components/gsap/reveal-text'
import { SpringButton } from '@/components/gsap/spring-button'
import DocsLayout from '@/layouts/docs-layout'

export default function Home() {
  return (
    <>
      <Head title="Welcome" />
      <DocsLayout>
        <div className="docs overflow-hidden bg-background pt-8 sm:pt-16 lg:pt-24">
          <div className="container">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 rounded-full bg-muted py-1 ps-1 pe-3 text-sm">
                <div className="rounded-full bg-primary p-1 text-primary-foreground">
                  <TargetIcon className="size-4" />
                </div>
                <p>Just open-sourced and still a work in progress</p>
              </div>

              <RevealText className="mt-3 text-balance text-center font-semibold text-2xl leading-[1.25] sm:text-3xl lg:text-4xl">
                Shadcn/ui meets Inertia.js
              </RevealText>
              <p className="mt-3 max-w-lg text-center font-semibold text-foreground/80 max-sm:text-sm lg:mt-5">
                DRY-er, more accessible{' '}
                <a href="https://ui.shadcn.com/" target="_blank" rel="noopener">
                  shadcn/ui
                </a>
                -alike{' '}
                <a
                  href="https://react-spectrum.adobe.com/react-aria/index.html"
                  target="_blank"
                  rel="noopener"
                >
                  React Aria
                </a>{' '}
                components, optimized for
                <a href="https://inertiajs.com/" target="_blank" rel="noopener">
                  {' '}
                  Inertia.js
                </a>{' '}
                with
                <a
                  href="https://laravel.com/docs/12.x/precognition#main-content"
                  target="_blank"
                  rel="noopener"
                >
                  &nbsp;Laravel's Precognition feature
                </a>{' '}
                build in.
              </p>
              <div className="mt-6 flex items-center gap-3 max-sm:flex-col sm:mt-8">
                <SpringButton
                  shaking={false}
                  className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-medium shadow-none"
                  onClick={() => (window.location.href = '/docs/')}
                >
                  <HugeiconsIcon icon={Rocket02Icon} className="size-4.5" />
                  Get started
                </SpringButton>
              </div>
            </div>
            <div className="mt-6 flex hidden justify-center sm:mt-8 lg:mt-12">
              <img
                src="https://images.unsplash.com/photo-1674027392842-29f8354e236c?w=1000"
                className="h-90 w-full max-w-4xl rounded-md object-cover shadow-xl sm:h-100 lg:h-120"
                alt="Hero Image"
              />
            </div>
          </div>
        </div>
      </DocsLayout>
    </>
  )
}
