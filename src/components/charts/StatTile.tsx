interface StatTileProps {
  label: string
  value: string
  note: string
  className?: string
}

// One headline number. Proportional figures (no tabular-nums) so big values
// don't look loose; tabular-nums is only for aligned table columns.
export function StatTile({ label, value, note, className = '' }: StatTileProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5 ${className}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:mt-2 lg:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </div>
  )
}
