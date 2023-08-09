import { Field, FieldProps } from "formik";

export function FormInput({name, displayName, type = "text", autoComplete = "off"}: {name: string, displayName: string, type?: string, autoComplete?: string}) {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className="relative flex justify-center w-full">
          <input type={type} className={`peer w-full h-14 outline outline-1 px-2 shadow-md rounded-md bg-transparent py-2 focus:transition-all focus:duration-300 focus:pt-4 focus:pb-0 autofill:pt-4 autofill:pb-0 autofill:bg-transparent ${(meta.error && meta.touched) ? 'outline-red-700 focus:shadow-red-700' : 'outline-gray-400 focus:shadow-primary_light focus:outline-primary_light'}`}  {...field} placeholder={displayName} autoComplete={autoComplete} />
          <p className="bg-transparent text-gray-500 text-sm absolute w-max h-min left-2 top-4 opacity-0 peer-focus:opacity-100 peer-focus:-translate-y-3 peer-focus:transition-all peer-focus:duration-300 peer-autofill:opacity-100 peer-autofill:-translate-y-3 peer-autofill:transition-all peer-autofill:duration-100 -z-10 peer-focus:z-10 peer-autofill:z-10 select-none">{displayName}</p>
        </div>
      )}
    </Field>
  )
}

export default FormInput