import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { DialogTrigger } from 'react-aria-components'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Checkbox } from '@/components/twc-ui/checkbox'
import { FormComboBox } from '@/components/twc-ui/combo-box'
import { Dialog } from '@/components/twc-ui/dialog'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormTextField } from '@/components/twc-ui/text-field'

interface Props {
  contact: App.Data.ContactData
  countries: App.Data.CountryData[]
}

export default function DialogFormDemo({ contact, countries }: Props) {
  const form = useForm<App.Data.ContactData>(
    'contact-form',
    'post',
    route('contact.store'),
    contact
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    // router.visit(route('app.invoice.index'))
    setIsOpen(false)
  }

  return (
    <DemoContainer>
      <Head title="Form Demo" />
      <DialogTrigger>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Edit contact
        </Button>
        <Dialog
          isOpen={isOpen}
          onClosed={handleClose}
          bodyPadding
          showDescription
          description="Change something and click cancel."
          title="Edit contact"
          confirmClose={form.isDirty}
          footer={dialogRenderProps => (
            <div className="mx-0 flex w-full gap-2">
              <div className="flex flex-1 justify-start" />
              <div className="flex flex-none gap-2">
                <Button variant="outline" onClick={dialogRenderProps.close}>
                  Abbrechen
                </Button>
                <Button variant="default" form={form.id} type="submit">
                  Speichern
                </Button>
              </div>
            </div>
          )}
        >
          <Form form={form}>
            <FormGrid>
              <div className="col-span-12">
                <FormTextField
                  autoFocus
                  isRequired
                  label="First name"
                  {...form.register('first_name')}
                />
                <div className="pt-0.5">
                  <Checkbox label="VIP" {...form.registerCheckbox('is_vip')} />
                </div>
              </div>
              <div className="col-span-12">
                <FormTextField isRequired label="Last name" {...form.register('last_name')} />
              </div>
              <div className="col-span-12">
                <FormTextField isRequired label="E-Mail" {...form.register('email')} />
              </div>
              <div className="col-span-12">
                <FormComboBox label="Country" {...form.register('country_id')} items={countries} />
              </div>
            </FormGrid>
          </Form>
        </Dialog>
      </DialogTrigger>
    </DemoContainer>
  )
}
