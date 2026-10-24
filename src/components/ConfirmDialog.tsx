import { dangerButton, secondaryButton } from '../utils/ui'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="px-5 py-5 sm:px-6">
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button type="button" onClick={onCancel} className={secondaryButton} data-autofocus>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className={dangerButton}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
