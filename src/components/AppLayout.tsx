import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AnalyticsIcon, LogoutIcon, RecordsIcon, ReportIcon } from './icons'
import { Logo } from './Logo'

const NAV = [
  { to: '/', label: 'Coverage', Icon: RecordsIcon, end: true },
  { to: '/report', label: 'Reports', Icon: ReportIcon, end: false },
  { to: '/analytics', label: 'Analytics', Icon: AnalyticsIcon, end: false },
]

// The private shell: sidebar on desktop, bottom tab bar on mobile.
// `print:hidden` removes the chrome when a report is printed to PDF.
export function AppLayout() {
  const { session, logout } = useAuth()

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr] print:block">
      <aside className="hidden border-r border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-dvh md:flex-col print:hidden">
        <div className="flex h-16 items-center border-b border-slate-100 px-5">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1 p-3">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 print:hidden">
          <Logo className="md:hidden" />
          <p className="hidden text-sm text-slate-500 md:block">
            Signed in as <span className="font-medium text-slate-900">{session?.username}</span>
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <LogoutIcon className="size-4" />
            Log out
          </button>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-8 print:p-0">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
      >
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                isActive ? 'text-brand-700' : 'text-slate-500'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
