const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const full = new Intl.NumberFormat('en')

/** Formats an ISO "YYYY-MM-DD" without time-zone shifting the day. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y, m - 1, d))
}

export const formatPercent = (share: number) => `${Math.round(share * 100)}%`
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
export const formatReach = (n: number) => compact.format(n)
export const formatNumber = (n: number) => full.format(n)
