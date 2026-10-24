// localStorage can throw (private windows, blocked site data, quota), so every
// access is wrapped. The app must still render without it.

export function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable: keep going with in-memory state only.
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}
