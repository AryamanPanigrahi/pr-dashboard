import { useMemo, useState } from 'react'
import { ChartCard } from '../components/charts/ChartCard'
import { MonthlyCoverageChart } from '../components/charts/MonthlyCoverageChart'
import { OutletChart } from '../components/charts/OutletChart'
import { StatTile } from '../components/charts/StatTile'
import { StatusBreakdown } from '../components/charts/StatusBreakdown'
import { EmptyState } from '../components/EmptyState'
import { Field } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { useRecords } from '../hooks/useRecords'
import {
  coverageByOutlet,
  filterRecords,
  monthlyCoverage,
  statusBreakdown,
  type AnalyticsFilters,
} from '../utils/analytics'
import { formatNumber, formatPercent, plural } from '../utils/format'
import { uniqueClients } from '../utils/records'
import { computeStats } from '../utils/report'
import { inputClass } from '../utils/ui'

export default function AnalyticsPage() {
  const { records } = useRecords()
  const clients = useMemo(() => uniqueClients(records), [records])
  const [filters, setFilters] = useState<AnalyticsFilters>({ client: 'all', from: '', to: '' })

  const rangeError =
    filters.from && filters.to && filters.from > filters.to
      ? 'The start date must be on or before the end date.'
      : ''

  // Everything below derives from the same filtered slice, so numbers agree.
  const scoped = useMemo(
    () => (rangeError ? [] : filterRecords(records, filters)),
    [records, filters, rangeError],
  )
  const stats = useMemo(() => computeStats(scoped), [scoped])
  const months = useMemo(() => monthlyCoverage(scoped), [scoped])
  const outlets = useMemo(() => coverageByOutlet(scoped), [scoped])
  const statuses = useMemo(() => statusBreakdown(scoped), [scoped])

  const set = <K extends keyof AnalyticsFilters>(key: K, value: AnalyticsFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }))

  return (
    <>
      <PageHeader title="Analytics" description="Coverage, reach and publish rate at a glance." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Client" id="a-client" className="col-span-2 sm:col-span-1">
          <select
            id="a-client"
            value={filters.client}
            onChange={(e) => set('client', e.target.value)}
            className={inputClass}
          >
            <option value="all">All clients</option>
            {clients.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="From" id="a-from">
          <input
            id="a-from"
            type="date"
            value={filters.from}
            onChange={(e) => set('from', e.target.value)}
            aria-invalid={rangeError ? true : undefined}
            className={inputClass}
          />
        </Field>
        <Field label="To" id="a-to">
          <input
            id="a-to"
            type="date"
            value={filters.to}
            onChange={(e) => set('to', e.target.value)}
            aria-invalid={rangeError ? true : undefined}
            className={inputClass}
          />
        </Field>
      </div>

      {rangeError ? (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {rangeError}
        </p>
      ) : scoped.length === 0 ? (
        <EmptyState title="No records match these filters" description="Widen the date range or pick another client." />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatTile
              label="Total coverage"
              value={String(stats.published)}
              note={`published, from ${plural(stats.total, 'pitch', 'pitches')}`}
            />
            <StatTile
              label="Publish rate"
              value={formatPercent(stats.publishRate)}
              note="of pitches resulted in coverage"
            />
            <StatTile
              label="Total reach"
              value={formatNumber(stats.totalReach)}
              note={`estimated audience, ${plural(stats.outlets, 'outlet', 'outlets')}`}
              className="col-span-2 sm:col-span-1"
            />
          </div>

          <ChartCard
            title="Coverage over time"
            description="Published pieces per month"
            chart={<MonthlyCoverageChart data={months} />}
            table={{
              head: ['Month', 'Pieces', 'Est. reach'],
              rows: months.map((m) => [m.fullLabel, m.coverage, formatNumber(m.reach)]),
            }}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Coverage by outlet"
              description="Published pieces, most first"
              chart={
                outlets.length > 0 ? (
                  <OutletChart data={outlets} />
                ) : (
                  <p className="py-10 text-center text-sm text-slate-500">No published coverage yet.</p>
                )
              }
              table={{
                head: ['Outlet', 'Pieces', 'Est. reach'],
                rows: outlets.map((o) => [o.outlet, o.coverage, formatNumber(o.reach)]),
              }}
            />
            <ChartCard
              title="Status breakdown"
              description="Where every pitch stands"
              chart={<StatusBreakdown data={statuses} />}
              table={{
                head: ['Status', 'Count', 'Share'],
                rows: statuses.map((s) => [s.status, s.count, formatPercent(s.share)]),
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
