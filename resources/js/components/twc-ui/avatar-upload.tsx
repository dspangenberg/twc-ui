import { MultiplicationSignIcon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-aria-components'
import { Avatar } from './avatar'
import { Button } from './button'
import { FileTrigger } from './file-trigger'

interface Props {
  src: string | null
  fullname: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  onSelect: (avatar: File | undefined) => void
}

export const AvatarUpload: React.FC<Props> = ({
  fullname,
  initials,
  size = 'md',
  src,
  onSelect
}) => {
  const [droppedImage, setDroppedImage] = useState<string | undefined>(src as string | undefined)

  useEffect(() => {
    return () => {
      if (droppedImage) {
        URL.revokeObjectURL(droppedImage)
      }
    }
  }, [droppedImage])

  useEffect(() => {
    setDroppedImage(prev => {
      if (prev?.startsWith('blob:') && prev !== src) {
        URL.revokeObjectURL(prev)
      }
      return src ?? undefined
    })
  }, [src])

  async function onSelectHandler(e: FileList | null) {
    if (!e || e.length === 0) return

    try {
      const item = e[0]

      if (item) {
        if (droppedImage?.startsWith('blob:')) {
          URL.revokeObjectURL(droppedImage)
        }

        setDroppedImage(URL.createObjectURL(item))
      }
      onSelect(item)
    } catch (error) {
      console.error('Something went wrong:', error)
    }
  }

  const removeAvatar = () => {
    if (droppedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(droppedImage)
    }
    setDroppedImage(undefined)
    onSelect(undefined)
  }

  return (
    <div className="relative">
      <FileTrigger
        acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
        onSelect={onSelectHandler}
      >
        <Pressable>
          <Avatar
            role="button"
            fullname={fullname}
            src={droppedImage}
            size={size}
            initials={initials}
            className="cursor-pointer"
            aria-label="Change avatar"
          />
        </Pressable>
      </FileTrigger>
      {droppedImage && (
        <Button
          variant="outline"
          size="icon-xs"
          className="absolute -bottom-1 -right-1 size-4 rounded-full"
          aria-label="Remove avatar"
          iconClassName="size-3"
          icon={MultiplicationSignIcon}
          onPress={removeAvatar}
        />
      )}
    </div>
  )
}
