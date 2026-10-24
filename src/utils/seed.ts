import type { PRRecord } from '../types'

// All clients, outlets and journalists below are made up for this demo.
export const SEED_RECORDS: PRRecord[] = [
  {
    id: 'rec-01', client: 'Aurelia Skincare', campaign: 'Autumn Glow Launch',
    outlet: 'Pulse Lifestyle', journalist: 'Chloe Bennett', status: 'Published',
    publishDate: '2026-10-12', reach: 420000, link: 'https://example.com/pulse/autumn-glow',
  },
  {
    id: 'rec-02', client: 'Aurelia Skincare', campaign: 'Autumn Glow Launch',
    outlet: 'The Morning Dispatch', journalist: 'Declan Moore', status: 'Follow-up',
    publishDate: '2026-10-20', reach: 250000, link: '',
  },
  {
    id: 'rec-03', client: 'Nimbus Cloud', campaign: 'Series B Announcement',
    outlet: 'Capital Review', journalist: 'Samuel Ortega', status: 'Published',
    publishDate: '2026-09-18', reach: 310000, link: 'https://example.com/capital-review/nimbus-series-b',
  },
  {
    id: 'rec-04', client: 'Nimbus Cloud', campaign: 'Series B Announcement',
    outlet: 'TechSignal', journalist: 'Mei Tanaka', status: 'Published',
    publishDate: '2026-09-19', reach: 580000, link: 'https://example.com/techsignal/nimbus-raises',
  },
  {
    id: 'rec-05', client: 'Nimbus Cloud', campaign: 'Developer Conference Keynote',
    outlet: 'TechSignal', journalist: 'Mei Tanaka', status: 'Pitched',
    publishDate: '2026-10-28', reach: 580000, link: '',
  },
  {
    id: 'rec-06', client: 'Brightpath Energy', campaign: 'Solar Community Programme',
    outlet: 'Green Horizon Magazine', journalist: 'Hannah Okoye', status: 'Published',
    publishDate: '2026-08-30', reach: 150000, link: 'https://example.com/green-horizon/solar-community',
  },
  {
    id: 'rec-07', client: 'Brightpath Energy', campaign: 'Solar Community Programme',
    outlet: 'The Daily Ledger', journalist: 'Ravi Nair', status: 'Rejected',
    publishDate: '2026-09-05', reach: 720000, link: '',
  },
  {
    id: 'rec-08', client: 'Brightpath Energy', campaign: 'Annual Sustainability Report',
    outlet: 'Metro Business Weekly', journalist: 'Elena Marsh', status: 'Follow-up',
    publishDate: '2026-10-15', reach: 260000, link: '',
  },
  {
    id: 'rec-09', client: 'Tidewater Coffee', campaign: 'Cold Brew Summer',
    outlet: 'Pulse Lifestyle', journalist: 'Chloe Bennett', status: 'Published',
    publishDate: '2026-07-14', reach: 390000, link: 'https://example.com/pulse/cold-brew-summer',
  },
  {
    id: 'rec-10', client: 'Tidewater Coffee', campaign: 'Cold Brew Summer',
    outlet: 'The Daily Ledger', journalist: 'Tomás Whitfield', status: 'Published',
    publishDate: '2026-07-22', reach: 690000, link: 'https://example.com/daily-ledger/cold-brew',
  },
  {
    id: 'rec-11', client: 'Tidewater Coffee', campaign: 'Fair-Trade Partnership',
    outlet: 'Green Horizon Magazine', journalist: 'Hannah Okoye', status: 'Rejected',
    publishDate: '2026-08-11', reach: 150000, link: '',
  },
  {
    id: 'rec-12', client: 'Aurelia Skincare', campaign: 'Founder Profile',
    outlet: 'Capital Review', journalist: 'Samuel Ortega', status: 'Published',
    publishDate: '2026-06-25', reach: 310000, link: 'https://example.com/capital-review/aurelia-founder',
  },
]
