import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '../hooks/AuthContext'
import { STORAGE_KEYS } from '../config'
import { attemptLogin, clearSession, loadSession, type Session } from '../utils/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  const login = useCallback((username: string, password: string) => {
    const next = attemptLogin(username, password)
    setSession(next)
    return next !== null
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  // Sign out when the session expires, even if the tab stays open.
  useEffect(() => {
    if (!session) return
    const timer = window.setTimeout(logout, Math.max(0, session.expiresAt - Date.now()))
    return () => window.clearTimeout(timer)
  }, [session, logout])

  // Keep several open tabs in step: logging out in one logs out all.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.session || e.key === null) setSession(loadSession())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
