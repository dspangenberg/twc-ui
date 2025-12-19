export const useFieldChange = (
  onChange?: ((value: string | null) => void) | ((value: string) => void)
) => {
  return (val: string) => {
    if (onChange) {
      try {
        onChange(val || '')
      } catch {
        ;(onChange as (value: string) => void)(val)
      }
    }
  }
}
