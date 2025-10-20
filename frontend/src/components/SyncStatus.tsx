import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'
import { QueueStats, subscribeQueueStats } from '../lib/offline'

type Props = {
  onSync: () => Promise<void>
}

export default function SyncStatus({ onSync }: Props) {
  const [online, setOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)
  const [queueStats, setQueueStats] = useState<QueueStats>({
    count: 0,
    oldestTimestamp: null,
    newestTimestamp: null,
  })
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null)
  const [lastSuccess, setLastSuccess] = useState<Date | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const formatTimestamp = useCallback((value: Date | number | null) => {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }, [])

  const flush = useCallback(async () => {
    setSyncing(true)
    const attempt = new Date()
    setLastAttempt(attempt)
    try {
      await onSync()
      setLastSuccess(new Date())
      setLastError(null)
    } catch (error) {
      setLastError(error instanceof Error ? error.message : 'Synchronisation impossible.')
    } finally {
      setSyncing(false)
    }
  }, [onSync])

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_TRIGGER') {
        flush()
      }
    }

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    navigator.serviceWorker?.addEventListener('message', handleMessage)
    const unsubscribeQueue = subscribeQueueStats(setQueueStats)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      navigator.serviceWorker?.removeEventListener('message', handleMessage)
      unsubscribeQueue()
    }
  }, [flush])

  const queueMessage = useMemo(() => {
    if (queueStats.count === 0) return 'Aucune opération en file.'
    const oldest = formatTimestamp(queueStats.oldestTimestamp)
    if (queueStats.count === 1) {
      return `1 opération en attente${oldest ? ` (depuis ${oldest})` : ''}.`
    }
    return `${queueStats.count} opérations en attente${oldest ? ` (depuis ${oldest})` : ''}.`
  }, [formatTimestamp, queueStats.count, queueStats.oldestTimestamp])

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
      <div className="flex flex-col gap-1 text-xs text-slate-500 sm:items-end">
        <span>{queueMessage}</span>
        <div className="flex flex-wrap gap-2">
          {lastAttempt && (
            <span className="text-slate-500">Dernière tentative: {formatTimestamp(lastAttempt)}</span>
          )}
          {lastSuccess && (
            <span className="text-emerald-600">
              Dernière réussite: {formatTimestamp(lastSuccess)}
            </span>
          )}
          {lastError && <span className="text-rose-600">{lastError}</span>}
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={flush} disabled={syncing}>
        {syncing ? 'Synchronisation...' : 'Forcer la synchronisation'}
      </Button>
    </div>
  )
}
