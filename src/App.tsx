import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AuthProvider } from './components/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RecordsPage from './pages/RecordsPage'
import ReportPage from './pages/ReportPage'

// Recharts is large and only this page uses it, so it loads on demand.
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<RecordsPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<p className="py-10 text-center text-sm text-slate-500">Loading charts…</p>}>
                    <AnalyticsPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
