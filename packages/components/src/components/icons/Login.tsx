import { LabelledIcon } from "./_LabelledIcon"

export function Login({ className, label, active }: { className: string, label: string, active: boolean }) {
  return (
    <LabelledIcon className={className} label={label} active={active}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
    </LabelledIcon>
  )
}
export default Login 
