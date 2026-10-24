import { useId, useState, type ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description: string
  chart: ReactNode
  /** The same data as plain rows: the accessible twin of the chart. */
  table: { head: string[]; rows: (string | number)[][] }
  className?: string
}

// Every chart ships with a table view, so no value depends on hovering or on
// telling colours apart.
export function ChartCard({ title, description, chart, table, className = '' }: ChartCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const titleId = useId()

  const tab = (v: 'chart' | 'table', label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  )

  return (
    <section
      aria-labelledby={titleId}
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-card ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id={titleId} className="text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex shrink-0 gap-0.5 rounded-lg bg-slate-100 p-0.5" role="group" aria-label="View">
          {tab('chart', 'Chart')}
          {tab('table', 'Table')}
        </div>
      </div>

      {view === 'chart' ? (
        chart
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {table.head.map((h, i) => (
                  <th key={h} scope="col" className={`py-2 pr-3 ${i > 0 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.rows.map((row) => (
                <tr key={String(row[0])}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`py-2 pr-3 ${i > 0 ? 'text-right tabular-nums text-slate-700' : 'text-slate-900'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
