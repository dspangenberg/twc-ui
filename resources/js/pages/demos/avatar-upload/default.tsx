import { useState } from 'react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { AvatarUpload } from '@/components/twc-ui/avatar-upload'

export default function Dashboard() {
  const [avatarUrl, setAvatarUrl] = useState<File | undefined>(undefined)
  return (
    <DemoContainer>
      <AvatarUpload
        src="https://github.com/shadcn.png"
        fullName="shadcn"
        initials="SC"
        size="lg"
        onSelect={setAvatarUrl}
      />
    </DemoContainer>
  )
}
