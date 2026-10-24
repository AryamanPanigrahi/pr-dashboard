import type { ReactNode } from 'react'

// The dashed card shown whenever a view has nothing to display. Optional
// children are call-to-action buttons.
export function EmptyState({
  title,
  description,
  className = '',
  children,
}: {
  title: string
  description: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={`rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-card ${className}`}>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {children && <div className="mt-4 flex justify-center gap-2">{children}</div>}
    </div>
  )
}
