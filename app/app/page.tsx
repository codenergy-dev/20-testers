'use client'

import { ValidatorException } from "@/src/exceptions/validator"
import { useForm } from "@/src/hooks/use-form"
import { validate } from "@/src/validators/app"

export default function Page() {
  const form = useForm<App>({})
  
  async function submit() {
    try {
      validate(form.values)
      await fetch('/api/app', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: form.toJson()
      })
    } catch (e) {
      if (e instanceof ValidatorException) {
        alert(e.message)
      } else console.error(e)
    }
  }
  
  return (
    <form className="p-4">
      <h1 className="text-3xl">
        Adding new app to testing
      </h1>
      <legend>
        Here you can share your app with other developers and people so they can test it
      </legend>
      <div className="h-4"></div>
      <div className="flex gap-4">
        <label className="flex-1 input input-bordered flex items-center gap-2">
          <span className="material-symbols-outlined">verified</span>
          <input {...form.getInputProps('applicationName')} type="text" className="grow" placeholder="Application name" />
        </label>
        <label className="flex-1 tooltip input input-bordered flex items-center gap-2" data-tip="Paste your invite link available on Play Console">
          <span className="material-symbols-outlined">android</span>
          <input {...form.getInputProps('packageName')} type="text" className="grow" placeholder="Package name" />
        </label>
      </div>
      <div className="h-4"></div>
      <label className="form-control">
        <textarea {...form.getInputProps('description')}className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
      </label>
      <div className="h-4"></div>
      <button type="button" onClick={submit} className="btn btn-primary btn-wide">Save</button>
    </form>
  )
}