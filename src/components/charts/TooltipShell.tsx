import type { ReactNode } from 'react'

// Shared tooltip look. The value leads (strong) and the name follows
// (secondary); the series is keyed by a short line, not a filled box.
export function TooltipShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 text-xs font-medium text-slate-500">{title}</p>
      {children}
    </div>
  )
}

export function TooltipRow({
  color,
  value,
  name,
}: {
  color?: string
  value: string
  name: string
}) {
  return (
    <div className="flex items-center gap-2">
      {color && <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />}
      <span className="font-semibold text-slate-900">{value}</span>
      <span className="text-slate-500">{name}</span>
    </div>
  )
}
