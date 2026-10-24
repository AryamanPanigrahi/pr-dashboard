import type { Status } from '../types'
import { STATUS_COLORS } from '../utils/chartTheme'

// Status colours are semantic (green = done, red = no), separate from the
// single brand accent used for actions. The dot uses the same colour as the
// analytics charts, so a status looks the same everywhere.
const PILLS: Record<Status, string> = {
  Published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pitched: 'bg-sky-50 text-sky-700 ring-sky-200',
  'Follow-up': 'bg-amber-50 text-amber-800 ring-amber-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PILLS[status]}`}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}
