import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormNumberField } from '@/components/twc-ui/form-number-field'

interface Product extends Record<string, any> {
  price: number
  quantity: number
  weight: number
  discount: number
}

export default function Demo() {
  const form = useForm<Product>('product-form', 'post', '/products', {
    price: 0,
    quantity: 1,
    weight: 0,
    discount: 0
  })

  return (
    <DemoContainer>
      <Head title="FormNumberField Demo" />
      <Form form={form} className="mx-auto max-w-lg">
        <FormGrid>
          <div className="col-span-12">
            <FormNumberField
              isRequired
              autoFocus
              description="Enter the product price in EUR"
              label="Price"
              {...form.register('price')}
            />
          </div>
          <div className="col-span-12">
            <FormNumberField
              isRequired
              description="Number of items in stock"
              label="Quantity"
              minValue={1}
              maxValue={1000}
              {...form.register('quantity')}
            />
          </div>
          <div className="col-span-12">
            <FormNumberField
              description="Weight in kilograms"
              label="Weight (kg)"
              minValue={0}
              step={0.1}
              formatOptions={{
                style: 'unit',
                unit: 'kilogram',
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
              }}
              {...form.register('weight')}
            />
          </div>
          <div className="col-span-12">
            <FormNumberField
              description="Discount percentage"
              label="Discount (%)"
              minValue={0}
              maxValue={100}
              step={5}
              formatOptions={{
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
              }}
              {...form.register('discount')}
            />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
