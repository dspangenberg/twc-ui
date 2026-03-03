import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormCard } from '@/components/twc-ui/form-card'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormNumberField } from '@/components/twc-ui/form-number-field'

interface FinancialData extends Record<string, any> {
  salary: number
  bonus: number
  tax_rate: number
  years_of_service: number
}

export default function FinancialDemo() {
  const form = useForm<FinancialData>('financial-form', 'post', '/financial', {
    salary: 50000,
    bonus: 5000,
    tax_rate: 0.22,
    years_of_service: 1
  })

  return (
    <DemoContainer>
      <Head title="FormNumberField Financial Demo" />
      <FormCard className="mx-auto max-w-lg">
        <Form form={form}>
          <FormGrid>
            <div className="col-span-24">
              <FormNumberField
                isRequired
                label="Annual Salary"
                description="Base annual salary in EUR"
                minValue={0}
                maxValue={1000000}
                step={1000}
                formatOptions={{
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0
                }}
                {...form.register('salary')}
              />
            </div>
            <div className="col-span-12">
              <FormNumberField
                label="Annual Bonus"
                description="Expected annual bonus"
                minValue={0}
                maxValue={100000}
                step={500}
                formatOptions={{
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0
                }}
                {...form.register('bonus')}
              />
            </div>
            <div className="col-span-12">
              <FormNumberField
                label="Tax Rate"
                description="Effective tax rate"
                minValue={0}
                maxValue={1}
                step={0.01}
                formatOptions={{
                  style: 'percent',
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 2
                }}
                {...form.register('tax_rate')}
              />
            </div>
            <div className="col-span-24">
              <FormNumberField
                isRequired
                label="Years of Service"
                description="Total years with the company"
                minValue={0}
                maxValue={50}
                step={1}
                formatOptions={{
                  style: 'unit',
                  unit: 'year',
                  unitDisplay: 'long'
                }}
                {...form.register('years_of_service')}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </DemoContainer>
  )
}
