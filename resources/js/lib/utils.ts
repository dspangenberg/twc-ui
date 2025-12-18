import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const focusRing = tv({
  base: 'outline-none',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'border-ring ring-[3px] ring-ring/50'
    }
  }
})
