import { ChangeEvent, useState } from "react"

export const useForm = <T>(initialValues: Partial<T>) => {
  const [values, setValues] = useState<T>(initialValues as T)

  function setFieldValue(key: keyof T, value: any) {
    setValues((oldValue) => ({ ...oldValue, [key]: value }) as T)
  }

  function getInputProps(key: keyof T) {
    return {
      value: values[key] as string,
      onChange: (event: ChangeEvent<any>) => {
        setFieldValue(key, event.target.value)
      }
    }
  }

  function toJson() {
    return JSON.stringify(values)
  }

  return { values, setFieldValue, getInputProps, toJson }
}