import type { Status } from '../types'

// Chart colours, from the dataviz reference palette (light mode). They are
// plain constants, not Tailwind classes, because Recharts draws SVG attributes.
// If the app gets a dark theme, this is the one object to swap.
export const CHART = {
  surface: '#ffffff', // card background; used for marker rings and bar gaps
  ink: '#0b0b0b',
  inkSecondary: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  series1: '#2a78d6',
  series1Hover: '#3987e5',
} as const

// Status colours are fixed across the app (table badges and charts match).
// Amber is sub-3:1 on white by design, so every use pairs it with a text label.
export const STATUS_COLORS: Record<Status, string> = {
  Published: '#0ca30c',
  Pitched: '#2a78d6',
  'Follow-up': '#fab219',
  Rejected: '#d03b3b',
}
