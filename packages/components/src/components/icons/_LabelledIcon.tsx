import type { ReactNode } from 'react';
export function LabelledIcon({ className, label, children, active }: { className: string, label: string, children: ReactNode, active: boolean }) {
  return (
    <div className={className}>
      <span className="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={active ? "none" : "currentColor"} className="size-6">
          {children}
        </svg>
        <label>{label}</label>
      </span>
    </div >
  )
}
export default LabelledIcon
