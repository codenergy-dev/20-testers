'use client'

import { AppCard } from "@/src/components/app-card"
import { InputImageUrl } from "@/src/components/input-image-url"
import { ValidatorException } from "@/src/exceptions/validator"
import { useForm } from "@/src/hooks/use-form"
import { validate } from "@/src/validators/app"

export default function Page() {
  const form = useForm<App>({
    screenshots: [],
  })

  function onIconChanged(icon: string) {
    form.setFieldValue('icon', icon)
  }

  function addScreenshot(screenshot: string) {
    form.setFieldValue('screenshots', [...form.values.screenshots, screenshot])
  }

  function onScreenshotChanged(screenshot: string, index: number) {
    form.values.screenshots[index] = screenshot
    form.setFieldValue('screenshots', form.values.screenshots)
  }
  
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
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex gap-4">
            <InputImageUrl
              id="app-icon"
              label="App icon"
              description="Copy the app icon URL from your application page on Google Play."
              value={form.values.icon}
              onChanged={onIconChanged}
            />
            <label className="flex-1 input input-bordered flex items-center gap-2">
              <input {...form.getInputProps('applicationName')} type="text" className="grow" placeholder="Application name" />
            </label>
          </div>
          <div className="h-4"></div>
          <label className="input input-bordered flex items-center gap-2">
            <span className="material-symbols-outlined">android</span>
            <input {...form.getInputProps('packageName')} type="text" className="grow" placeholder="Package name" />
          </label>
          <div className="h-4"></div>
          <label className="flex-1 form-control">
            <textarea {...form.getInputProps('description')} className="textarea textarea-bordered h-full" placeholder="Description"></textarea>
          </label>
        </div>
        <AppCard app={form.values as App} />
      </div>
      <div className="h-4"></div>
      <div className="flex flex-wrap gap-4">
        <InputImageUrl
          id="app-screenshot"
          label="App screenshot"
          description="Copy the app screenshot URL from your application page on Google Play."
          onChanged={addScreenshot}
          className="w-32 h-64"
        />
        {form.values.screenshots.map((screenshot, i) => (
          <InputImageUrl
            key={screenshot}
            id={['app-screenshot', i].join('-')}
            label="App screenshot"
            description="Copy the app screenshot URL from your application page on Google Play."
            value={screenshot}
            onChanged={(screenshot) => onScreenshotChanged(screenshot, i)}
            className="w-32 h-64"
          />
        ))}
      </div>
      <div className="h-4"></div>
      <button type="button" onClick={submit} className="btn btn-primary btn-wide">Save</button>
    </form>
  )
}