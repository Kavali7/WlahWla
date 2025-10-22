import React, { useEffect, useState } from 'react'

export default function SyncStatus({onSync}:{onSync:()=>Promise<void>}) {
  const [online, setOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const onO = () => setOnline(true)
    const onF = () => setOnline(false)
    navigator.serviceWorker?.addEventListener('message', (evt:any) => {
      if (evt.data?.type === 'SYNC_TRIGGER') flush()
    })
    window.addEventListener('online', onO)
    window.addEventListener('offline', onF)
    return () => { window.removeEventListener('online', onO); window.removeEventListener('offline', onF); }
  }, [])

  async function flush() {
    setSyncing(true)
    try { await onSync() } finally { setSyncing(false) }
  }

  return (
    <div className="text-sm">
      <span className={online ? 'text-green-600' : 'text-red-600'}>
        {online ? 'En ligne' : 'Hors ligne (les actions seront synchronisées)'}
      </span>
      <button className="btn ml-2" onClick={flush} disabled={syncing}>{syncing ? 'Sync...' : 'Forcer la sync'}</button>
    </div>
  )
}
