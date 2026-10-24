# Harbor & Pine PR: Coverage Dashboard (demo)

A private PR-management dashboard for a media/PR agency: track pitches and
published coverage, generate client reports, and see analytics. It is a
**frontend-only demo**. All names, outlets and numbers are fictional.

**Demo login:** `demo` / `demo123`

> The login is a demo of the flow (protected routes, logout), **not real
> security**. The credentials ship in the browser bundle and the session lives
> in `localStorage`, so anyone can read or forge them. A production version
> would authenticate on a server.

## Features

| Feature | Where to see it | Code |
|---|---|---|
| Login and route protection | `/login`, every other page | `pages/LoginPage.tsx`, `components/ProtectedRoute.tsx`, `utils/auth.ts` |
| Coverage table with search, filters, sort | `/` | `pages/RecordsPage.tsx`, `components/RecordsList.tsx`, `utils/records.ts` |
| Add / edit / delete with validation | Buttons on `/` | `components/RecordFormModal.tsx`, `components/ConfirmDialog.tsx`, `components/Modal.tsx` |
| Client report with print-to-PDF | `/report` | `pages/ReportPage.tsx`, `components/ReportDocument.tsx`, `utils/report.ts`, `utils/print.ts` |
| Analytics charts | `/analytics` | `pages/AnalyticsPage.tsx`, `components/charts/*`, `utils/analytics.ts` |
| Mobile and desktop layouts | Resize the window | `components/AppLayout.tsx` (sidebar to bottom tabs), card view in `RecordsList.tsx` |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and production build into dist/
npm run lint
```

Stack: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Recharts.

## Folder structure

```
src/
  main.tsx, App.tsx     Entry point and the route table
  config.ts             App name, demo credentials, storage keys, session length
  types.ts              The PRRecord type and the four statuses
  index.css             Tailwind, the brand colour, print (A4) styles
  pages/                One file per screen: Login, Records, Report, Analytics
  components/           Reusable UI: layout shell, modal, form, table/cards, report document
    charts/             Stat tiles, chart cards (with a Table view), the three charts
  hooks/                useRecords (data + localStorage), useAuth (session)
  utils/                Plain functions with no UI: filtering, validation, report maths,
                        analytics maths, formatting, storage, seed data, chart colours
```

The rule of thumb: **pages** assemble screens, **components** draw things,
**utils** hold the logic (so it is easy to read and test), **hooks** connect
state to storage.

## How it works

- **Data.** Records live in `localStorage` (key `prd.records`), seeded from
  `utils/seed.ts` on first visit. `hooks/useRecords.ts` loads, validates and
  saves them, and syncs between open tabs. "Restore sample data" appears if
  you delete everything.
- **Route guard.** `ProtectedRoute` wraps every private route and sends
  signed-out visitors to `/login`, then back to where they were going. Only
  in-app paths are followed after login. The session expires after 8 hours.
- **Validation.** `utils/records.ts` checks required fields, whole-number
  reach and `http(s)` links (so `javascript:` links are rejected). Stored
  records are re-checked on load, and links are checked again before being
  rendered.
- **Reports.** Pick a client and dates, press Generate. The summary paragraph
  is a template filled from the numbers (no AI service), so it always matches
  the table. **Download PDF** uses the browser's print dialog; `index.css`
  sets A4 margins, hides the sidebar and controls, and keeps table rows whole.
- **Analytics.** One filter row scopes every tile and chart. "Publish rate" is
  published items divided by all pitches in the period, the same definition
  the report uses. Every chart has a **Table** toggle so no number depends on
  hovering or telling colours apart. Colours come from `utils/chartTheme.ts`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), choose **Add New > Project** and import
   the repository.
3. Vercel detects Vite. Keep the defaults (build command `npm run build`,
   output directory `dist`) and press **Deploy**.
4. Every push to `main` redeploys automatically.

`vercel.json` already contains the rewrite that makes direct links such as
`/report` work after a refresh, plus basic security headers. It sets
`X-Frame-Options: DENY`, so the site cannot be embedded in an `<iframe>`;
remove that line if you want to embed the demo in a portfolio page.

## Limits of the demo

- No backend: data is per browser and disappears if site data is cleared.
- Reach figures are made-up estimates.
- Dark mode is not implemented; chart colours are defined in one object
  (`utils/chartTheme.ts`) so it could be added.
