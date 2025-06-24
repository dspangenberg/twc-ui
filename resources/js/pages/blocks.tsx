import { Head } from '@inertiajs/react'
import DocsLayout from '@/layouts/docs-layout'

export default function Home() {
  return (
    <>
      <Head title="Welcome" />
      <DocsLayout>
        <div className="docs overflow-hidden bg-background pt-8 sm:pt-16 lg:pt-24">Soon.</div>
      </DocsLayout>
    </>
  )
}
