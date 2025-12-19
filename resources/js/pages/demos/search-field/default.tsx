import { DemoContainer } from '@/components/docs/DemoContainer'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { SearchField } from '@/components/twc-ui/search-field'
export default function Demo() {
  return (
    <DemoContainer>
      <FormGrid className="mx-auto max-w-lg">
        <div className="col-span-12">
          <SearchField autoFocus />
        </div>
      </FormGrid>
    </DemoContainer>
  )
}
