import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Field } from '../components/Field'
import { DownloadIcon } from '../components/icons'
import { PageHeader } from '../components/PageHeader'
import { ReportDocument } from '../components/ReportDocument'
import { useRecords } from '../hooks/useRecords'
import { formatDate } from '../utils/format'
import { printWithTitle } from '../utils/print'
import { uniqueClients } from '../utils/records'
import { dateSpan, recordsFor, type ReportParams } from '../utils/report'
import { inputClass, primaryButton, secondaryButton } from '../utils/ui'

export default function ReportPage() {
  const { records } = useRecords()
  const clients = useMemo(() => uniqueClients(records), [records])
  const span = useMemo(() => dateSpan(records), [records])

  const [client, setClient] = useState(clients[0] ?? '')
  const [from, setFrom] = useState(span.from)
  const [to, setTo] = useState(span.to)
  // The report shows a snapshot taken when "Generate" is pressed, so it does
  // not reshuffle while the user is still picking options.
  const [generated, setGenerated] = useState<{ params: ReportParams; at: Date } | null>(null)

  const rangeError = from && to && from > to ? 'The start date must be on or before the end date.' : ''
  const canGenerate = Boolean(client && from && to) && !rangeError
  const stale =
    generated !== null &&
    (generated.params.client !== client || generated.params.from !== from || generated.params.to !== to)

  const reportRecords = useMemo(
    () => (generated ? recordsFor(records, generated.params) : []),
    [records, generated],
  )

  function generate() {
    if (canGenerate) setGenerated({ params: { client, from, to }, at: new Date() })
  }

  function download() {
    if (!generated) return
    const { client: c, from: f, to: t } = generated.params
    printWithTitle(`Coverage report - ${c} - ${formatDate(f)} to ${formatDate(t)}`)
  }

  if (records.length === 0) {
    return (
      <>
        <PageHeader title="Reports" description="Generate a print-ready client coverage report." />
        <EmptyState title="No records to report on" description="Add coverage records first, then come back here." />
      </>
    )
  }

  return (
    <>
      <div className="print:hidden">
        <PageHeader title="Reports" description="Generate a print-ready client coverage report." />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Client" id="r-client" className="col-span-2 sm:col-span-1">
              <select id="r-client" value={client} onChange={(e) => setClient(e.target.value)} className={inputClass}>
                {clients.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="From" id="r-from">
              <input
                id="r-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                aria-invalid={rangeError ? true : undefined}
                aria-describedby={rangeError ? 'r-range-error' : undefined}
                className={inputClass}
              />
            </Field>
            <Field label="To" id="r-to">
              <input
                id="r-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-invalid={rangeError ? true : undefined}
                aria-describedby={rangeError ? 'r-range-error' : undefined}
                className={inputClass}
              />
            </Field>
          </div>

          {rangeError && (
            <p id="r-range-error" role="alert" className="mt-3 text-sm font-medium text-rose-600">
              {rangeError}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button type="submit" disabled={!canGenerate} className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}>
              Generate report
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!generated || stale}
              className={`${secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <DownloadIcon className="size-4" />
              Download PDF
            </button>
            {stale && (
              <p className="text-sm text-amber-700" role="status">
                Options changed. Generate again to update the report.
              </p>
            )}
          </div>
        </form>
      </div>

      {generated ? (
        <ReportDocument params={generated.params} records={reportRecords} generatedOn={generated.at} />
      ) : (
        <EmptyState
          title="Choose a client and date range"
          description="Then press Generate report. Use Download PDF to save it via your browser's print dialog."
          className="print:hidden"
        />
      )}
    </>
  )
}
