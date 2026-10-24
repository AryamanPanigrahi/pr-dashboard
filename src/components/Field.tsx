import type { ReactNode } from 'react'

// A label above a control, with an optional error line below. `id` must match
// the control's id; the error gets `${id}-error` for aria-describedby.
export function Field({
  label,
  id,
  error,
  className,
  children,
}: {
  label: string
  id: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}
