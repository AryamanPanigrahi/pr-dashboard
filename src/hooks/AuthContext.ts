import { createContext } from 'react'
import type { Session } from '../utils/auth'

export interface AuthContextValue {
  session: Session | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
