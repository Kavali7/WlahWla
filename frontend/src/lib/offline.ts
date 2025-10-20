import { openDB } from 'idb'

const DB_NAME = 'uemoa-offline'
const STORE = 'queue'
const QUEUE_EVENT = 'offline-queue-status'

export type QueueStats = {
  count: number
  oldestTimestamp: number | null
  newestTimestamp: number | null
}

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

async function emitQueueEvent(): Promise<QueueStats | null> {
  if (typeof window === 'undefined') return null
  try {
    const stats = await getQueueStats()
    window.dispatchEvent(new CustomEvent(QUEUE_EVENT, { detail: stats }))
    return stats
  } catch {
    return null
  }
}

export async function queueRequest(config: any) {
  const database = await db()
  const toSave = { ...config, __queued: true, time: Date.now() }
  await database.add(STORE, toSave)
  await emitQueueEvent()
  try {
    const registration = await navigator.serviceWorker?.ready
    await registration?.sync.register('sync-queue')
  } catch {
    // ignore sync registration errors when offline
  }
}

export async function flushQueue(api: any) {
  const database = await db()
  const transaction = database.transaction(STORE, 'readwrite')
  const store = transaction.store
  let cursor = await store.openCursor()
  while (cursor) {
    const item: any = cursor.value
    try {
      await api.request({ ...item, __queued: false })
      await cursor.delete()
    } catch {
      break
    }
    cursor = await cursor.continue()
  }
  await transaction.done
  return emitQueueEvent()
}

export async function getQueueStats(): Promise<QueueStats> {
  const database = await db()
  const count = await database.count(STORE)
  if (count === 0) {
    return { count: 0, oldestTimestamp: null, newestTimestamp: null }
  }
  const transaction = database.transaction(STORE, 'readonly')
  const store = transaction.store
  let cursor = await store.openCursor()
  let oldest: number | null = null
  let newest: number | null = null
  while (cursor) {
    const recordTime = Number(cursor.value?.time ?? 0)
    if (recordTime) {
      if (oldest === null || recordTime < oldest) oldest = recordTime
      if (newest === null || recordTime > newest) newest = recordTime
    }
    cursor = await cursor.continue()
  }
  await transaction.done
  return { count, oldestTimestamp: oldest, newestTimestamp: newest }
}

export function subscribeQueueStats(listener: (stats: QueueStats) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<QueueStats>
    if (customEvent.detail) {
      listener(customEvent.detail)
    }
  }
  window.addEventListener(QUEUE_EVENT, handler as EventListener)
  getQueueStats()
    .then(listener)
    .catch(() => {
      // ignore initialization error
    })
  return () => window.removeEventListener(QUEUE_EVENT, handler as EventListener)
}
