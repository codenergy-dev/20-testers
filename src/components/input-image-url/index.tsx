import { useForm } from "@/src/hooks/use-form"

interface InputImageUrlProps {
  id: string
  className?: string
  label: string
  description?: string
  value?: string
  onChanged: (value: string) => void
}

export function InputImageUrl({
  id,
  className = 'w-12 h-12', 
  label,
  description,
  value = '', 
  onChanged
}: InputImageUrlProps) {
  const form = useForm({imageUrl: value})
  
  return (
    <>
      <div
        className={[
          'cursor-pointer tooltip relative flex items-center justify-center rounded-xl hover:bg-primary hover:bg-opacity-5',
          value ? 'avatar' : 'border-2 border-dashed',
          className ?? '',
        ].join(' ')}
        data-tip={label}
        onClick={() => (document.getElementById(id) as any).showModal()}
      >
        {!value && <span className="material-symbols-outlined">image</span>}
        {value && <img src={value} className="rounded-xl" />}
        <div className="absolute w-6 h-6 -top-2 -right-2 rounded-full bg-primary">
          <span className="text-sm text-white material-symbols-outlined">edit</span>
        </div>
      </div>
      <dialog id={id} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{label}</h3>
          {description && <p className="py-4">{description}</p>}
          <label className="flex-1 input input-bordered flex items-center gap-2">
            <span className="material-symbols-outlined">image</span>
            <input {...form.getInputProps('imageUrl')} type="text" className="grow" placeholder="https://play-lh.googleusercontent.com/..." />
          </label>
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => (document.getElementById(id) as any).close()}
            >Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                (document.getElementById(id) as any).close()
                onChanged(form.values.imageUrl)
              }}
            >Save</button>
          </div>
        </div>
      </dialog>
    </>
  )
}