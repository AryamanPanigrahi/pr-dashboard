import { APP_NAME } from '../config'
import type { PRRecord } from '../types'
import { formatDate, formatNumber, formatPercent, plural } from './format'

export interface ReportParams {
  client: string
  /** Inclusive ISO dates. */
  from: string
  to: string
}

export interface ReportStats {
  total: number
  published: number
  inProgress: number
  rejected: number
  /** Published items as a share of all pitches in the period, 0 to 1. */
  publishRate: number
  /** Combined estimated audience of published items only. */
  totalReach: number
  outlets: number
  top: PRRecord | null
}

export function recordsFor(records: PRRecord[], p: ReportParams): PRRecord[] {
  return records
    .filter((r) => r.client === p.client && r.publishDate >= p.from && r.publishDate <= p.to)
    .sort((a, b) => a.publishDate.localeCompare(b.publishDate))
}

export function computeStats(rs: PRRecord[]): ReportStats {
  const published = rs.filter((r) => r.status === 'Published')
  const top = published.reduce<PRRecord | null>((best, r) => (!best || r.reach > best.reach ? r : best), null)
  return {
    total: rs.length,
    published: published.length,
    inProgress: rs.filter((r) => r.status === 'Pitched' || r.status === 'Follow-up').length,
    rejected: rs.filter((r) => r.status === 'Rejected').length,
    publishRate: rs.length ? published.length / rs.length : 0,
    totalReach: published.reduce((sum, r) => sum + r.reach, 0),
    outlets: new Set(published.map((r) => r.outlet)).size,
    top,
  }
}

export function dateSpan(records: PRRecord[]): { from: string; to: string } {
  const dates = records.map((r) => r.publishDate).sort()
  return { from: dates[0] ?? '', to: dates[dates.length - 1] ?? '' }
}

// Template-based on purpose: the numbers always match the table, and nothing
// is sent to an AI service. Swap this function for an LLM call later if wanted.
export function buildSummary(p: ReportParams, s: ReportStats): string {
  const period = `${formatDate(p.from)} and ${formatDate(p.to)}`
  if (s.total === 0) {
    return `No coverage activity was recorded for ${p.client} between ${period}.`
  }

  const parts: string[] = []
  if (s.published === 0) {
    parts.push(
      `Between ${period}, ${APP_NAME} pitched ${p.client} ${plural(s.total, 'time', 'times')} but no coverage has been published yet.`,
    )
  } else {
    parts.push(
      `Between ${period}, ${APP_NAME} secured ${plural(s.published, 'piece', 'pieces')} of coverage for ${p.client} across ${plural(s.outlets, 'outlet', 'outlets')}, with an estimated combined audience of ${formatNumber(s.totalReach)}.`,
    )
    if (s.top) {
      parts.push(
        `The strongest result was "${s.top.campaign}" in ${s.top.outlet}, reaching an estimated ${formatNumber(s.top.reach)}.`,
      )
    }
  }

  parts.push(
    `${s.published} of ${plural(s.total, 'pitch', 'pitches')} resulted in publication, a ${formatPercent(s.publishRate)} publish rate.`,
  )

  const open = []
  if (s.inProgress) open.push(`${s.inProgress} still in progress`)
  if (s.rejected) open.push(`${s.rejected} declined`)
  if (open.length) parts.push(`The remainder: ${open.join(' and ')}.`)

  return parts.join(' ')
}
