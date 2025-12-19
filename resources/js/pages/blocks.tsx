import { Head } from '@inertiajs/react'
import DocsLayout from '@/layouts/docs-layout'

export default function Home() {
  return (
    <>
      <Head title="Welcome" />
      <DocsLayout>
        <div className="docs flex h-screen items-center justify-center overflow-hidden bg-background pt-8 text-8xl">
          Soon.
        </div>
      </DocsLayout>
    </>
  )
}
