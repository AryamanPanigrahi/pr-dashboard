import { useId, useState, type FormEvent } from 'react'
import { STATUSES, type PRRecord, type RecordInput } from '../types'
import {
  toFormValues,
  toInput,
  validate,
  type FormErrors,
  type FormValues,
} from '../utils/records'
import { inputClass, primaryButton, secondaryButton } from '../utils/ui'
import { Field } from './Field'
import { Modal } from './Modal'

interface Props {
  open: boolean
  /** The record being edited, or null when adding. */
  record: PRRecord | null
  clients: string[]
  onSave: (input: RecordInput) => void
  onClose: () => void
}

export function RecordFormModal({ open, record, clients, onSave, onClose }: Props) {
  return (
    <Modal open={open} title={record ? 'Edit coverage record' : 'Add coverage record'} onClose={onClose}>
      <RecordForm record={record} clients={clients} onSave={onSave} onClose={onClose} />
    </Modal>
  )
}

function RecordForm({ record, clients, onSave, onClose }: Omit<Props, 'open'>) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(record))
  const [errors, setErrors] = useState<FormErrors>({})
  const listId = useId()

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    // Clear a field's error as soon as the user edits it.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length === 0) onSave(toInput(values))
  }

  const field = (key: keyof FormValues) => ({
    id: `f-${key}`,
    name: key,
    value: values[key],
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `f-${key}-error` : undefined,
    className: inputClass,
  })

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
        <Field label="Client" id="f-client" error={errors.client}>
          <input
            {...field('client')}
            list={listId}
            autoComplete="off"
            data-autofocus
            onChange={(e) => set('client', e.target.value)}
          />
          <datalist id={listId}>
            {clients.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Campaign" id="f-campaign" error={errors.campaign}>
          <input {...field('campaign')} onChange={(e) => set('campaign', e.target.value)} />
        </Field>
        <Field label="Outlet / publication" id="f-outlet" error={errors.outlet}>
          <input {...field('outlet')} onChange={(e) => set('outlet', e.target.value)} />
        </Field>
        <Field label="Journalist" id="f-journalist" error={errors.journalist}>
          <input {...field('journalist')} onChange={(e) => set('journalist', e.target.value)} />
        </Field>
        <Field label="Status" id="f-status">
          <select
            {...field('status')}
            onChange={(e) => set('status', e.target.value as FormValues['status'])}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Publish date" id="f-publishDate" error={errors.publishDate}>
          <input type="date" {...field('publishDate')} onChange={(e) => set('publishDate', e.target.value)} />
        </Field>
        <Field label="Reach (estimated audience)" id="f-reach" error={errors.reach}>
          <input
            {...field('reach')}
            inputMode="numeric"
            placeholder="e.g. 250000"
            onChange={(e) => set('reach', e.target.value)}
          />
        </Field>
        <Field label="Coverage link (optional)" id="f-link" error={errors.link}>
          <input
            {...field('link')}
            type="url"
            placeholder="https://"
            onChange={(e) => set('link', e.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button type="button" onClick={onClose} className={secondaryButton}>
          Cancel
        </button>
        <button type="submit" className={primaryButton}>
          {record ? 'Save changes' : 'Add record'}
        </button>
      </div>
    </form>
  )
}

