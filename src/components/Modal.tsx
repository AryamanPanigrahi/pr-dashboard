import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'
import { XIcon } from './icons'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

function isOutsideBox(e: MouseEvent<HTMLDialogElement>): boolean {
  const box = e.currentTarget.getBoundingClientRect()
  return e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom
}

// Wraps the native <dialog>: focus trap, Esc handling and the backdrop come
// from the browser. Children mount only while open, so forms reset each time.
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const pressStartedOnBackdrop = useRef(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // showModal() focuses the first control (the close button). Let content
      // choose a better start, e.g. Cancel on a delete confirmation.
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Close on a backdrop click only. Clicks on the dialog's own scrollbar or
      // edge also target the <dialog>, so compare coordinates with its box; and
      // ignore a drag that began inside it (e.g. selecting text).
      onMouseDown={(e) => {
        pressStartedOnBackdrop.current = isOutsideBox(e)
      }}
      onClick={(e) => {
        if (pressStartedOnBackdrop.current && isOutsideBox(e)) onClose()
      }}
      className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/40"
    >
      {open && (
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 id={titleId} className="text-base font-semibold tracking-tight">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <XIcon className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
