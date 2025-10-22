import { openDB } from 'idb'

const DB_NAME = 'uemoa-offline'
const STORE = 'queue'

async function db() {
  return await openDB(DB_NAME, 1, { upgrade(db) { db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true }) } })
}

export async function queueRequest(config:any) {
  const d = await db()
  const toSave = { ...config, __queued: true, time: Date.now() }
  await d.add(STORE, toSave)
  try {
    const reg = await navigator.serviceWorker?.ready
    await reg?.sync.register('sync-queue')
  } catch {}
}

export async function flushQueue(api:any) {
  const d = await db()
  const tx = d.transaction(STORE, 'readwrite')
  const store = tx.store
  let cursor = await store.openCursor()
  while (cursor) {
    const item:any = cursor.value
    try {
      await api.request({ ...item, __queued: false })
      await cursor.delete()
    } catch (e) {
      // stop on first failure while online to avoid loops
      break
    }
    cursor = await cursor.continue()
  }
  await tx.done
}
