import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'
import { Button } from '@/components/twc-ui/button'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-lg space-y-4">
      <Alert
        title="Email Verification Required"
        actions={
          <div className="flex gap-2">
            <Button size="auto" title="Resend Email" />
            <Button variant="outline" size="auto" title="Not Now" />
          </div>
        }
      >
        Please verify your email address to access all features. Check your inbox for the
        verification link.
      </Alert>

      <Alert
        variant="destructive"
        title="Update Required"
        actions={
          <div className="flex gap-2">
            <Button variant="destructive" size="auto" title="Update Now" />
            <Button variant="ghost" size="auto" title="Later" />
          </div>
        }
      >
        A critical security update is available for your account. Please update to continue using
        our services safely.
      </Alert>

      <Alert
        variant="success"
        title="Download Complete"
        actions={
          <div className="flex gap-2">
            <Button size="auto" title="Open File" />
            <Button variant="outline" size="auto" title="Show in Folder" />
          </div>
        }
      >
        Your file has been successfully downloaded and is ready to use.
      </Alert>
    </DemoContainer>
  )
}
