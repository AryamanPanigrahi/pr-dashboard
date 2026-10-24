import { useState } from 'react'
import type { Status } from '../../types'
import type { StatusPoint } from '../../utils/analytics'
import { STATUS_COLORS } from '../../utils/chartTheme'
import { formatPercent } from '../../utils/format'

// Part-to-whole as one stacked bar (a donut makes close values hard to compare).
// Segments are separated by a 2px gap of card colour, never a border. Every
// status is also a labelled row beneath, so identity never rests on colour
// alone; that matters most for amber, which is faint on white.
export function StatusBreakdown({ data }: { data: StatusPoint[] }) {
  const [active, setActive] = useState<Status | null>(null)
  const total = data.reduce((sum, p) => sum + p.count, 0)

  const dim = (status: Status) => (active && active !== status ? 0.4 : 1)

  return (
    <div onMouseLeave={() => setActive(null)}>
      <div className="flex h-5 gap-0.5 overflow-hidden rounded" role="img" aria-label={`Status breakdown of ${total} pitches. The list below gives each count.`}>
        {data
          .filter((p) => p.count > 0)
          .map((p) => (
            <div
              key={p.status}
              title={`${p.status}: ${p.count} (${formatPercent(p.share)})`}
              onMouseEnter={() => setActive(p.status)}
              className="min-w-1.5 transition-opacity"
              style={{ flexGrow: p.count, backgroundColor: STATUS_COLORS[p.status], opacity: dim(p.status) }}
            />
          ))}
      </div>

      <ul className="mt-5 divide-y divide-slate-100">
        {data.map((p) => (
          <li
            key={p.status}
            onMouseEnter={() => setActive(p.status)}
            className="flex items-center gap-3 py-2.5 text-sm transition-opacity"
            style={{ opacity: dim(p.status) }}
          >
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: STATUS_COLORS[p.status] }} aria-hidden="true" />
            <span className="flex-1 text-slate-900">{p.status}</span>
            <span className="font-semibold text-slate-900 tabular-nums">{p.count}</span>
            <span className="w-12 text-right text-slate-500 tabular-nums">{formatPercent(p.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
