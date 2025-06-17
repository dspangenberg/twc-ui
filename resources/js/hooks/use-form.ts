import type { FormDataConvertible, FormDataKeys, FormDataValues } from '@inertiajs/core'
import { useForm as useInertiaForm } from 'laravel-precognition-react-inertia'
import type { ChangeEvent } from 'react'
import type { RequestMethod, ValidationConfig } from 'laravel-precognition'
import { isEqual } from 'moderndash'

type InputElements = HTMLInputElement | HTMLSelectElement;

export function useForm<T extends Record<string, FormDataConvertible>> (
  method: RequestMethod,
  url: string,
  data: T,
  config?: ValidationConfig
) {

  // Capture the very first snapshot only once
  const initialDataRef = useRef({ ...data })
  const form = useInertiaForm<T>(method, url, data, config)
- const isDirty = !isEqual(initialData, form.data)
+ const isDirty = !isEqual(initialDataRef.current, form.data)

  const updateAndValidateWithoutEvent = <K extends FormDataKeys<T>> (
    name: K,
    value: FormDataValues<T, K>
  ) => {
    form.touched(name)
    form.setData(name, value)
    form.validate(name)
  }

  function register<K extends FormDataKeys<T>> (name: K) {
    return {
      name,
      value: form.data[name],
      error: form.errors[name],
      onChange: (value: FormDataValues<T, K>) => {
        form.touched(name)
        form.setData(name, value)
        form.validate(name)
      },
      onBlur: () => {
        form.touched(name)
        form.validate(name)
      }
    } as const
  }

  function registerEvent<K extends FormDataKeys<T>> (name: K) {
    return {
      name,
      value: form.data[name],
      error: form.errors[name],
      onChange: (e: ChangeEvent<InputElements>) => {
        form.setData(name, e.currentTarget.value as FormDataValues<T, K>)
        form.validate(name)
      },
      onBlur: () => {
        form.validate(name)
      }
    } as const
  }

  const registerCheckbox = <K extends FormDataKeys<T>> (name: K) => {
    return {
      name,
      checked: Boolean(form.data[name]),
      hasError: !!form.errors[name],
      isSelected: Boolean(form.data[name]),
      onChange: (checked: boolean) => {
        form.setData(name, checked as FormDataValues<T, K>)
        form.validate(name)
      },
      onBlur: () => {
        form.validate(name)
      }
    } as const
  }

  const updateAndValidate = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {
      name,
      value,
      type
    } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    form.touched(name)
    form.setData(name as FormDataKeys<T>, newValue as FormDataValues<T, FormDataKeys<T>>)
    form.validate(name as FormDataKeys<T>)
  }

  form.isDirty = isDirty

  return {
    ...form,
    isDirty,
    register,
    registerEvent,
    registerCheckbox,
    updateAndValidate,
    updateAndValidateWithoutEvent
  } as const
}
