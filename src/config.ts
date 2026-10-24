// Central place for app-wide constants.

export const APP_NAME = 'Harbor & Pine PR'

// DEMO ONLY. These credentials ship in the browser bundle, so anyone can read
// them. The login exists to show the flow (protected routes, logout), not to
// secure anything. A real product would verify credentials on a server.
export const DEMO_USERNAME = 'demo'
export const DEMO_PASSWORD = 'demo123'

export const STORAGE_KEYS = {
  session: 'prd.session',
  records: 'prd.records',
} as const

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours
