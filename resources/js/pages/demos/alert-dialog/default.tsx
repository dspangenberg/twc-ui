import { DemoContainer } from '@/components/docs/DemoContainer'
import { AlertDialog } from '@/components/twc-ui/alert-dialog'
import { Button } from '@/components/twc-ui/button'

export const Demo = () => {
  const onOpenAlertDialogClicked = async () => {
    const confirmed = await AlertDialog.call({
      title: 'Are you absolutely sure?',
      message:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      buttonTitle: 'Delete Account',
      variant: 'destructive'
    })
    await AlertDialog.call({
      title: 'Info',
      message: confirmed ? 'Account deleted successfully' : 'Account deletion cancelled',
      variant: 'info'
    })
  }

  return (
    <DemoContainer className="gap-4">
      <Button variant="outline" title="Open Alert Dialog" onClick={onOpenAlertDialogClicked} />
    </DemoContainer>
  )
}

export default Demo
