import React, { useEffect, useState } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'

type Props = {
  onSync: () => Promise<void>
}

export default function SyncStatus({ onSync }: Props) {
  const [online, setOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)

    navigator.serviceWorker?.addEventListener('message', (event: any) => {
      if (event.data?.type === 'SYNC_TRIGGER') {
        flush()
      }
    })

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const flush = async () => {
    setSyncing(true)
    try {
      await onSync()
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <Badge variant={online ? 'success' : 'warning'}>
          {online ? 'En ligne' : 'Hors connexion'}
        </Badge>
        <span>
          {online
            ? 'Les donnees se synchronisent automatiquement entre vos appareils.'
            : 'Vos actions seront envoyees des le retablissement du reseau.'}
        </span>
      </div>
      <Button variant="secondary" size="sm" onClick={flush} disabled={syncing}>
        {syncing ? 'Synchronisation...' : 'Forcer la synchronisation'}
      </Button>
    </div>
  )
}
