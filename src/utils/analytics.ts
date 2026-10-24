import { STATUSES, type PRRecord, type Status } from '../types'

export interface AnalyticsFilters {
  client: string | 'all'
  /** Inclusive ISO dates; empty means unbounded. */
  from: string
  to: string
}

export function filterRecords(records: PRRecord[], f: AnalyticsFilters): PRRecord[] {
  return records.filter(
    (r) =>
      (f.client === 'all' || r.client === f.client) &&
      (!f.from || r.publishDate >= f.from) &&
      (!f.to || r.publishDate <= f.to),
  )
}

export interface MonthPoint {
  key: string
  /** Short axis label, e.g. "Sep 26". */
  label: string
  /** Long label for tooltips, e.g. "September 2026". */
  fullLabel: string
  coverage: number
  reach: number
}

const shortMonth = new Intl.DateTimeFormat('en-GB', { month: 'short', year: '2-digit' })
const longMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })

/** Published pieces per calendar month, with empty months filled in as zero. */
export function monthlyCoverage(rs: PRRecord[]): MonthPoint[] {
  if (rs.length === 0) return []
  const keys = rs.map((r) => r.publishDate.slice(0, 7)).sort()
  const [y0, m0] = keys[0].split('-').map(Number)
  const [y1, m1] = keys[keys.length - 1].split('-').map(Number)

  const points: MonthPoint[] = []
  let y = y0
  let m = m0
  while (y < y1 || (y === y1 && m <= m1)) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    const inMonth = rs.filter((r) => r.status === 'Published' && r.publishDate.startsWith(key))
    const d = new Date(y, m - 1, 1)
    points.push({
      key,
      label: shortMonth.format(d),
      fullLabel: longMonth.format(d),
      coverage: inMonth.length,
      reach: inMonth.reduce((sum, r) => sum + r.reach, 0),
    })
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return points
}

export interface OutletPoint {
  outlet: string
  coverage: number
  reach: number
}

/** Published pieces per outlet, largest first. The tail folds into "Other". */
export function coverageByOutlet(rs: PRRecord[], max = 8): OutletPoint[] {
  const map = new Map<string, OutletPoint>()
  for (const r of rs) {
    if (r.status !== 'Published') continue
    const p = map.get(r.outlet) ?? { outlet: r.outlet, coverage: 0, reach: 0 }
    p.coverage += 1
    p.reach += r.reach
    map.set(r.outlet, p)
  }
  const sorted = [...map.values()].sort(
    (a, b) => b.coverage - a.coverage || b.reach - a.reach || a.outlet.localeCompare(b.outlet),
  )
  if (sorted.length <= max) return sorted

  const rest = sorted.slice(max - 1)
  return [
    ...sorted.slice(0, max - 1),
    {
      outlet: `Other (${rest.length} outlets)`,
      coverage: rest.reduce((s, p) => s + p.coverage, 0),
      reach: rest.reduce((s, p) => s + p.reach, 0),
    },
  ]
}

export interface StatusPoint {
  status: Status
  count: number
  share: number
}

/** Counts in a fixed status order, so colours and rows never reshuffle. */
export function statusBreakdown(rs: PRRecord[]): StatusPoint[] {
  return STATUSES.map((status) => {
    const count = rs.filter((r) => r.status === status).length
    return { status, count, share: rs.length ? count / rs.length : 0 }
  })
}
