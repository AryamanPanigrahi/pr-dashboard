import { APP_NAME } from '../config'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
        H
      </span>
      <span className="text-sm font-semibold tracking-tight text-slate-900">{APP_NAME}</span>
    </div>
  )
}
