import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { FormComboBox } from '@/components/twc-ui/combo-box'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormNumberField } from '@/components/twc-ui/number-field'
import { FormTextField, FormTextAreaField } from '@/components/twc-ui/text-field'
import { Checkbox } from '@/components/twc-ui/checkbox'
import { DatePicker } from '@/components/twc-ui/date-picker'
import { Dialog } from '@/components/twc-ui/dialog'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { DialogTrigger } from 'react-aria-components'
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

  const handleSubmit = () => {
    setIsOpen(false)
  }

  return (
    <DemoContainer>
      <Head title="Form Demo" />
      <DialogTrigger>
        <Button variant="default" onClick={() => setIsOpen(true)}>Edit contact</Button>
      <Dialog
        isOpen={isOpen}
        onClosed={handleClose}
        bodyPadding
        showDescription
        description="Change something to get the form dirty and to confirm cancel."
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
            <FormTextField autoFocus isRequired label="First name" {...form.register('first_name')} />
            <div className="pt-0.5">
              <Checkbox label="VIP" {...form.registerCheckbox('is_vip')}  />
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
