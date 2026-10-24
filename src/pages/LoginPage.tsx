import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { InfoIcon } from '../components/icons'
import { Logo } from '../components/Logo'
import { DEMO_PASSWORD, DEMO_USERNAME } from '../config'
import { useAuth } from '../hooks/useAuth'
import { safeRedirect } from '../utils/auth'

import { inputClass as baseInputClass } from '../utils/ui'

const inputClass = `mt-1.5 ${baseInputClass}`

export default function LoginPage() {
  const { session, login } = useAuth()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const destination = safeRedirect((location.state as { from?: unknown } | null)?.from)

  // Already signed in (or just signed in): go where the user was heading.
  if (session) return <Navigate to={destination} replace />

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!login(username, password)) setError('Incorrect username or password.')
  }

  function fillDemo() {
    setUsername(DEMO_USERNAME)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Logo className="mb-6 justify-center" />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to the coverage dashboard.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Sign in
            </button>
          </form>
        </div>

        <div className="mt-4 flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
          <InfoIcon className="mt-0.5 size-4" />
          <div>
            <p className="font-semibold">Demo credentials</p>
            <p className="mt-0.5">
              Username <code className="font-mono font-semibold">{DEMO_USERNAME}</code> · Password{' '}
              <code className="font-mono font-semibold">{DEMO_PASSWORD}</code>
            </p>
            <button type="button" onClick={fillDemo} className="mt-2 font-semibold underline underline-offset-2">
              Fill them in
            </button>
            <p className="mt-2 text-xs text-brand-700/80">
              Demo only: this login is not real security. All data is fictional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
