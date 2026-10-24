import { STATUSES, type PRRecord, type RecordInput, type Status } from '../types'

export type SortKey = 'date-desc' | 'date-asc' | 'reach-desc' | 'reach-asc'

export interface Filters {
  query: string
  status: Status | 'all'
  client: string | 'all'
  sort: SortKey
}

export const DEFAULT_FILTERS: Filters = { query: '', status: 'all', client: 'all', sort: 'date-desc' }

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'reach-desc', label: 'Highest reach' },
  { value: 'reach-asc', label: 'Lowest reach' },
]

export function applyFilters(records: PRRecord[], f: Filters): PRRecord[] {
  const q = f.query.trim().toLowerCase()
  const out = records.filter((r) => {
    if (f.status !== 'all' && r.status !== f.status) return false
    if (f.client !== 'all' && r.client !== f.client) return false
    if (!q) return true
    return [r.client, r.campaign, r.outlet, r.journalist].some((v) => v.toLowerCase().includes(q))
  })

  const [field, dir] = f.sort.split('-') as ['date' | 'reach', 'asc' | 'desc']
  const sign = dir === 'asc' ? 1 : -1
  return out.sort((a, b) => {
    // ISO dates compare correctly as strings.
    const diff = field === 'date' ? a.publishDate.localeCompare(b.publishDate) : a.reach - b.reach
    return diff * sign || a.client.localeCompare(b.client)
  })
}

// crypto.randomUUID only exists on secure origins (https or localhost), so a
// plain-http LAN preview would throw. The fallback is unique enough for a demo.
export function newId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function uniqueClients(records: PRRecord[]): string[] {
  return [...new Set(records.map((r) => r.client))].sort((a, b) => a.localeCompare(b))
}

// Links come from user input or localStorage, so only ever render http(s) ones.
// This blocks `javascript:` URLs.
export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export function isRecord(value: unknown): value is PRRecord {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.client === 'string' &&
    typeof r.campaign === 'string' &&
    typeof r.outlet === 'string' &&
    typeof r.journalist === 'string' &&
    typeof r.status === 'string' &&
    (STATUSES as readonly string[]).includes(r.status) &&
    typeof r.publishDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.publishDate) &&
    typeof r.reach === 'number' &&
    Number.isFinite(r.reach) &&
    typeof r.link === 'string'
  )
}

/** The form edits everything as text; this is the shape before conversion. */
export type FormValues = Record<keyof Omit<RecordInput, 'status'>, string> & { status: Status }
export type FormErrors = Partial<Record<keyof FormValues, string>>

export function validate(v: FormValues): FormErrors {
  const e: FormErrors = {}
  if (!v.client.trim()) e.client = 'Client is required.'
  if (!v.campaign.trim()) e.campaign = 'Campaign is required.'
  if (!v.outlet.trim()) e.outlet = 'Outlet is required.'
  if (!v.journalist.trim()) e.journalist = 'Journalist is required.'

  if (!v.publishDate) e.publishDate = 'Date is required.'
  else if (Number.isNaN(Date.parse(v.publishDate))) e.publishDate = 'Enter a valid date.'

  if (v.reach.trim() === '') e.reach = 'Reach is required.'
  else if (!/^\d+$/.test(v.reach.trim())) e.reach = 'Use a whole number, 0 or more.'
  else if (Number(v.reach) > 10_000_000_000) e.reach = 'That number is too large.'

  if (v.link.trim() && !isHttpUrl(v.link.trim())) e.link = 'Use a full link starting with http:// or https://'
  return e
}

export function toInput(v: FormValues): RecordInput {
  return {
    client: v.client.trim(),
    campaign: v.campaign.trim(),
    outlet: v.outlet.trim(),
    journalist: v.journalist.trim(),
    status: v.status,
    publishDate: v.publishDate,
    reach: Number(v.reach.trim()),
    link: v.link.trim(),
  }
}

export function toFormValues(r: PRRecord | null): FormValues {
  return {
    client: r?.client ?? '',
    campaign: r?.campaign ?? '',
    outlet: r?.outlet ?? '',
    journalist: r?.journalist ?? '',
    status: r?.status ?? 'Pitched',
    publishDate: r?.publishDate ?? '',
    reach: r ? String(r.reach) : '',
    link: r?.link ?? '',
  }
}
