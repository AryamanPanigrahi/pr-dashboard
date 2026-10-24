import type { PRRecord } from '../types'
import { formatDate, formatNumber, formatReach } from '../utils/format'
import { isHttpUrl } from '../utils/records'
import { EditIcon, ExternalIcon, TrashIcon } from './icons'
import { StatusBadge } from './StatusBadge'

interface Props {
  records: PRRecord[]
  onEdit: (record: PRRecord) => void
  onDelete: (record: PRRecord) => void
}

const iconButton =
  'rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'

function Actions({ record, onEdit, onDelete }: { record: PRRecord } & Omit<Props, 'records'>) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {isHttpUrl(record.link) && (
        <a
          href={record.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open coverage: ${record.campaign} in ${record.outlet}`}
          className={iconButton}
        >
          <ExternalIcon className="size-4" />
        </a>
      )}
      <button
        type="button"
        onClick={() => onEdit(record)}
        aria-label={`Edit ${record.campaign} in ${record.outlet}`}
        className={iconButton}
      >
        <EditIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(record)}
        aria-label={`Delete ${record.campaign} in ${record.outlet}`}
        className={`${iconButton} hover:bg-rose-50 hover:text-rose-600`}
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  )
}

export function RecordsList({ records, onEdit, onDelete }: Props) {
  return (
    <>
      {/* Desktop: table. The sidebar eats 232px, so below 1024px it is cards. */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Client &amp; campaign</th>
              <th scope="col" className="px-4 py-3">Outlet &amp; journalist</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Publish date</th>
              <th scope="col" className="px-4 py-3 text-right">Reach</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{r.client}</div>
                  <div className="text-slate-500">{r.campaign}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-900">{r.outlet}</div>
                  <div className="text-slate-500">{r.journalist}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(r.publishDate)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700" title={formatNumber(r.reach)}>
                  {formatReach(r.reach)}
                </td>
                <td className="px-3 py-3"><Actions record={r} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile and tablet: cards */}
      <ul className="space-y-3 lg:hidden">
        {records.map((r) => (
          <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{r.client}</p>
                <p className="text-sm text-slate-500">{r.campaign}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-3 text-sm text-slate-900">{r.outlet}</p>
            <p className="text-sm text-slate-500">{r.journalist}</p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">
                {formatDate(r.publishDate)} · <span className="tabular-nums">{formatReach(r.reach)}</span> reach
              </p>
              <Actions record={r} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
