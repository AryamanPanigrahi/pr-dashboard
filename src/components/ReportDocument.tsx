import { APP_NAME } from '../config'
import type { PRRecord } from '../types'
import { formatDate, formatNumber, formatPercent } from '../utils/format'
import { isHttpUrl } from '../utils/records'
import { buildSummary, computeStats, type ReportParams } from '../utils/report'
import { Logo } from './Logo'
import { StatusBadge } from './StatusBadge'

interface Props {
  params: ReportParams
  records: PRRecord[]
  generatedOn: Date
}

const th = 'px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500'
const td = 'px-3 py-2.5 align-top'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="break-inside-avoid rounded-xl border border-slate-200 bg-slate-50 p-4 print:bg-white">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
    </div>
  )
}

// The printable report. Everything inside is designed to read well on A4;
// the page's chrome is hidden by `print:hidden` classes elsewhere.
export function ReportDocument({ params, records, generatedOn }: Props) {
  const stats = computeStats(records)
  const published = records.filter((r) => r.status === 'Published')
  const other = records.filter((r) => r.status !== 'Published')

  return (
    <article
      aria-label={`Coverage report for ${params.client}`}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none"
    >
      <header className="flex flex-col gap-4 border-b-2 border-brand-600 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Coverage report</h2>
          <p className="mt-1 text-lg text-slate-700">{params.client}</p>
        </div>
        <dl className="text-sm sm:text-right">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Reporting period</dt>
          <dd className="font-medium text-slate-900">
            {formatDate(params.from)} – {formatDate(params.to)}
          </dd>
          <dt className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Prepared by</dt>
          <dd className="font-medium text-slate-900">{APP_NAME}</dd>
          <dt className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Generated</dt>
          <dd className="font-medium text-slate-900">{formatDate(toIso(generatedOn))}</dd>
        </dl>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Summary numbers">
        <Stat label="Coverage pieces" value={String(stats.published)} />
        <Stat label="Publish rate" value={formatPercent(stats.publishRate)} />
        <Stat label="Total reach" value={formatNumber(stats.totalReach)} />
        <Stat label="Outlets" value={String(stats.outlets)} />
      </section>

      <section className="mt-6 break-inside-avoid">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Summary</h3>
        <p className="text-sm leading-relaxed text-slate-800">{buildSummary(params, stats)}</p>
      </section>

      {records.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No records for this client in the selected period.
        </p>
      ) : (
        <>
          <section className="mt-8">
            <h3 className="mb-2 break-after-avoid text-sm font-semibold uppercase tracking-wide text-slate-500">
              Coverage secured
            </h3>
            {published.length === 0 ? (
              <p className="text-sm text-slate-500">No published coverage in this period.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 print:overflow-visible">
                <table className="w-full min-w-[640px] text-left text-sm print:min-w-0">
                  <thead className="border-b border-slate-200 bg-slate-50 print:bg-white">
                    <tr>
                      <th scope="col" className={th}>Date</th>
                      <th scope="col" className={th}>Outlet &amp; journalist</th>
                      <th scope="col" className={th}>Campaign</th>
                      <th scope="col" className={`${th} text-right`}>Reach</th>
                      <th scope="col" className={th}>Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {published.map((r) => (
                      <tr key={r.id} className="break-inside-avoid">
                        <td className={`${td} whitespace-nowrap`}>{formatDate(r.publishDate)}</td>
                        <td className={td}>
                          <div className="font-medium text-slate-900">{r.outlet}</div>
                          <div className="text-slate-500">{r.journalist}</div>
                        </td>
                        <td className={td}>{r.campaign}</td>
                        <td className={`${td} text-right tabular-nums`}>{formatNumber(r.reach)}</td>
                        <td className={`${td} max-w-[14rem] break-all text-xs`}>
                          {isHttpUrl(r.link) ? (
                            <a
                              href={r.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-700 underline underline-offset-2"
                            >
                              {r.link.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-slate-400">–</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="break-inside-avoid border-t-2 border-slate-200 bg-slate-50 font-semibold print:bg-white">
                      <td className={td} colSpan={3}>Total</td>
                      <td className={`${td} text-right tabular-nums`}>{formatNumber(stats.totalReach)}</td>
                      <td className={td} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          {other.length > 0 && (
            <section className="mt-8">
              <h3 className="mb-2 break-after-avoid text-sm font-semibold uppercase tracking-wide text-slate-500">
                Pipeline &amp; outcomes
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 print:overflow-visible">
                <table className="w-full min-w-[520px] text-left text-sm print:min-w-0">
                  <thead className="border-b border-slate-200 bg-slate-50 print:bg-white">
                    <tr>
                      <th scope="col" className={th}>Date</th>
                      <th scope="col" className={th}>Outlet &amp; journalist</th>
                      <th scope="col" className={th}>Campaign</th>
                      <th scope="col" className={th}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {other.map((r) => (
                      <tr key={r.id} className="break-inside-avoid">
                        <td className={`${td} whitespace-nowrap`}>{formatDate(r.publishDate)}</td>
                        <td className={td}>
                          <div className="font-medium text-slate-900">{r.outlet}</div>
                          <div className="text-slate-500">{r.journalist}</div>
                        </td>
                        <td className={td}>{r.campaign}</td>
                        <td className={td}><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}

      <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-400">
        {APP_NAME} · Demo report with fictional data. Reach figures are estimated audience sizes.
      </footer>
    </article>
  )
}

// Local calendar date as YYYY-MM-DD (toISOString would shift to UTC).
function toIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
