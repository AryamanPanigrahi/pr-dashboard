export const STATUSES = ['Pitched', 'Published', 'Rejected', 'Follow-up'] as const
export type Status = (typeof STATUSES)[number]

export interface PRRecord {
  id: string
  client: string
  campaign: string
  outlet: string
  journalist: string
  status: Status
  /** ISO date, YYYY-MM-DD. For pitched items this is the target date. */
  publishDate: string
  /** Estimated audience size. */
  reach: number
  /** Optional http(s) link to the coverage. */
  link: string
}

export type RecordInput = Omit<PRRecord, 'id'>
