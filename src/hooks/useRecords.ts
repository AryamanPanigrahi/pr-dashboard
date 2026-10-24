import { useCallback, useEffect, useRef, useState } from 'react'
import { STORAGE_KEYS } from '../config'
import type { PRRecord, RecordInput } from '../types'
import { isRecord, newId } from '../utils/records'
import { SEED_RECORDS } from '../utils/seed'
import { readJSON, writeJSON } from '../utils/storage'

// First visit (nothing stored) or corrupted data -> seed. A stored empty list
// is respected: the user deleted everything on purpose.
function loadRecords(): PRRecord[] {
  const stored = readJSON<unknown>(STORAGE_KEYS.records)
  if (Array.isArray(stored) && stored.every(isRecord)) return stored
  return SEED_RECORDS
}

export function useRecords() {
  const [records, setRecords] = useState<PRRecord[]>(loadRecords)
  const loaded = useRef(false)

  // Persist after real changes only: reading the records (Reports, Analytics)
  // must not rewrite storage, or a stale tab could clobber newer data.
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true
      return
    }
    writeJSON(STORAGE_KEYS.records, records)
  }, [records])

  // Pick up changes made in another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.records || e.key === null) setRecords(loadRecords())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((input: RecordInput) => {
    setRecords((prev) => [{ ...input, id: newId() }, ...prev])
  }, [])

  const update = useCallback((id: string, input: RecordInput) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...input, id } : r)))
  }, [])

  const remove = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const reset = useCallback(() => setRecords(SEED_RECORDS), [])

  return { records, add, update, remove, reset }
}
