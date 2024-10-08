import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Field, ErrorMessage, FieldProps } from 'formik';
import _ from 'lodash';
import { useState } from 'react';

function FormGroup({ name, displayName, required = false, type = "text", autoComplete, disabled = false }: { name: string, displayName?: string, required?: boolean, type?: string, autoComplete?: string, disabled?: boolean }) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid grid-cols-4 gap-4 items-center w-full">
      <Field id={name}
        name={name}
      >
        {({
          field,
          meta,
        }: FieldProps) => (
          <>
            <label
              htmlFor={name}
              className={`text-sm font-bold ${meta.error && meta.touched ? 'text-red-700' : ''}`}
            >{displayName ? displayName : _.startCase(name)}{required && "*"}</label>
            {type === 'password' ? (
              <div className="relative flex items-center col-span-2">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={displayName ? displayName : _.startCase(name)} {...field}
                  autoComplete={autoComplete}
                  className={`outline outline-1 shadow-inner focus:shadow-box-sm rounded px-2 py-1 w-full ${meta.error && meta.touched ? 'outline-red-700 focus:shadow-red-700' : ' outline-gray-400 focus:shadow-primary_light focus:outline-primary_light '}`}
                  onBlur={(e) => {
                    field.onBlur(e);
                    setShowConfirmPassword(false);
                  }} 
                  disabled={disabled}/>
                {showConfirmPassword ? <EyeSlashIcon className="w-4 absolute right-1 text-gray-600 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : <EyeIcon className="w-4 absolute right-1 text-gray-600 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />}
              </div>
            ) : (
            <input
              type={type}
              placeholder={displayName ? displayName : _.startCase(name)} {...field}
              autoComplete={autoComplete}
              className={`outline outline-1 shadow-inner focus:shadow-box-sm rounded px-2 py-1 col-span-2 ${meta.error && meta.touched ? 'outline-red-700 focus:shadow-red-700' : ' outline-gray-400 focus:shadow-primary_light focus:outline-primary_light '}`} 
              disabled={disabled}/>
            )}
          </>
        )}
      </Field>
      <ErrorMessage name={name} component="p" className="text-red-700 text-xs text-center" />
    </div >
  )
}

export default FormGroup