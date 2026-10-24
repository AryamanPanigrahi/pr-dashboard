import {
  DEMO_PASSWORD,
  DEMO_USERNAME,
  SESSION_TTL_MS,
  STORAGE_KEYS,
} from '../config'
import { readJSON, removeKey, writeJSON } from './storage'

export interface Session {
  username: string
  expiresAt: number
}

// Demo-only auth: see the note in config.ts.
export function attemptLogin(username: string, password: string): Session | null {
  if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) return null
  const session: Session = {
    username: DEMO_USERNAME,
    expiresAt: Date.now() + SESSION_TTL_MS,
  }
  writeJSON(STORAGE_KEYS.session, session)
  return session
}

// Anything stored is untrusted input: check its shape and expiry, and clear
// it if it is malformed or stale.
export function loadSession(): Session | null {
  const stored = readJSON<Partial<Session>>(STORAGE_KEYS.session)
  if (
    stored &&
    typeof stored.username === 'string' &&
    typeof stored.expiresAt === 'number' &&
    stored.expiresAt > Date.now()
  ) {
    return { username: stored.username, expiresAt: stored.expiresAt }
  }
  if (stored) removeKey(STORAGE_KEYS.session)
  return null
}

export function clearSession(): void {
  removeKey(STORAGE_KEYS.session)
}

// Only follow in-app paths after login. Rejects "//evil.com" and absolute URLs.
export function safeRedirect(path: unknown): string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
    ? path
    : '/'
}
