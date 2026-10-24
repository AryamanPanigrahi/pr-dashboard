import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { PlusIcon, SearchIcon } from '../components/icons'
import { PageHeader } from '../components/PageHeader'
import { RecordFormModal } from '../components/RecordFormModal'
import { RecordsList } from '../components/RecordsList'
import { useRecords } from '../hooks/useRecords'
import { STATUSES, type PRRecord, type RecordInput } from '../types'
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  applyFilters,
  uniqueClients,
  type Filters,
} from '../utils/records'
import { inputClass, primaryButton, secondaryButton } from '../utils/ui'

// null = closed, 'new' = adding, a record = editing it.
type FormTarget = null | 'new' | PRRecord

export default function RecordsPage() {
  const { records, add, update, remove, reset } = useRecords()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [formTarget, setFormTarget] = useState<FormTarget>(null)
  const [toDelete, setToDelete] = useState<PRRecord | null>(null)

  const clients = useMemo(() => uniqueClients(records), [records])
  const visible = useMemo(() => applyFilters(records, filters), [records, filters])
  const filtersActive =
    filters.query !== '' || filters.status !== 'all' || filters.client !== 'all'

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }))

  function save(input: RecordInput) {
    if (formTarget && formTarget !== 'new') update(formTarget.id, input)
    else add(input)
    setFormTarget(null)
  }

  function confirmDelete() {
    if (toDelete) remove(toDelete.id)
    setToDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Coverage"
        description="Every pitch, placement and follow-up in one place."
        actions={
          <button type="button" onClick={() => setFormTarget('new')} className={primaryButton}>
            <PlusIcon className="size-4" />
            Add record
          </button>
        }
      />

      {records.length === 0 ? (
        <EmptyState title="No coverage records yet" description="Add your first record, or restore the sample data.">
          <button type="button" onClick={() => setFormTarget('new')} className={primaryButton}>
            Add record
          </button>
          <button type="button" onClick={reset} className={secondaryButton}>
            Restore sample data
          </button>
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_180px_160px]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={filters.query}
                onChange={(e) => set('query', e.target.value)}
                placeholder="Search records…"
                aria-label="Search records"
                className={`${inputClass} pl-9`}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => set('status', e.target.value as Filters['status'])}
              aria-label="Filter by status"
              className={inputClass}
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={filters.client}
              onChange={(e) => set('client', e.target.value)}
              aria-label="Filter by client"
              className={inputClass}
            >
              <option value="all">All clients</option>
              {clients.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(e) => set('sort', e.target.value as Filters['sort'])}
              aria-label="Sort records"
              className={inputClass}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <p className="mb-3 text-sm text-slate-500" aria-live="polite">
            Showing {visible.length} of {records.length} records
            {filtersActive && (
              <>
                {' · '}
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort }))}
                  className="font-medium text-brand-700 underline underline-offset-2"
                >
                  Clear filters
                </button>
              </>
            )}
          </p>

          {visible.length === 0 ? (
            <EmptyState title="No records match your filters" description="Try a different search or clear the filters." />
          ) : (
            <RecordsList records={visible} onEdit={setFormTarget} onDelete={setToDelete} />
          )}
        </>
      )}

      <RecordFormModal
        open={formTarget !== null}
        record={formTarget && formTarget !== 'new' ? formTarget : null}
        clients={clients}
        onSave={save}
        onClose={() => setFormTarget(null)}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this record?"
        message={
          toDelete
            ? `"${toDelete.campaign}" in ${toDelete.outlet} (${toDelete.client}) will be permanently removed.`
            : ''
        }
        confirmLabel="Delete record"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
