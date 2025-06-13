import { Head } from '@inertiajs/react'
import DocsLayout from '@/layouts/docs-layout'

export default function Home () {

  return (
    <>
      <Head title="Welcome" />
      <DocsLayout>
        <div className="bg-background overflow-hidden pt-8 sm:pt-16 lg:pt-24 docs">
          Soon.
        </div>
      </DocsLayout>
    </>
  )
}
