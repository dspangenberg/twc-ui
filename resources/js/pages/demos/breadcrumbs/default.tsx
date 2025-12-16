import { DemoContainer } from '@/components/docs/DemoContainer'
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs
} from '@/components/twc-ui/breadcrumbs'
export const Demo = () => {
  return (
    <DemoContainer className="gap-4">
      <nav aria-label="Breadcrumbs">
        <Breadcrumbs>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/react-aria/">React Aria</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumbs>
      </nav>
    </DemoContainer>
  )
}

export default Demo
