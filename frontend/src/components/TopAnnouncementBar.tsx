import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type AnnouncementAction = {
  label: string
  href: string
  external?: boolean
}

export type AnnouncementConfig = {
  id: string
  badge?: string
  message: string
  action?: AnnouncementAction
  dismissible?: boolean
}

export type TopAnnouncementBarProps = {
  announcement: AnnouncementConfig | null
  className?: string
}

const STORAGE_PREFIX = 'wlahwla.announcement.'

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const isBrowser = typeof window !== 'undefined'

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({ announcement, className }) => {
  const [dismissed, setDismissed] = useState(false)

  const storageKey = useMemo(
    () => (announcement ? `${STORAGE_PREFIX}${announcement.id}` : null),
    [announcement],
  )

  useEffect(() => {
    if (!announcement || !storageKey || !isBrowser) return
    const stored = window.localStorage.getItem(storageKey)
    setDismissed(stored === 'dismissed')
  }, [announcement, storageKey])

  if (!announcement || dismissed) {
    return null
  }

  const handleDismiss = () => {
    if (!announcement.dismissible) return
    setDismissed(true)
    if (storageKey && isBrowser) {
      window.localStorage.setItem(storageKey, 'dismissed')
    }
  }

  const renderAction = () => {
    if (!announcement.action) return null
    const { href, label, external } = announcement.action
    const baseClasses =
      'group inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600 focus-visible:ring-white'

    if (external) {
      return (
        <a
          className={baseClasses}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          <span>{label}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            {'->'}
          </span>
        </a>
      )
    }

    return (
      <Link className={baseClasses} to={href}>
        <span>{label}</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          {'->'}
        </span>
      </Link>
    )
  }

  return (
    <div
      className={cx(
        'w-full bg-primary-600 text-primary-foreground shadow-sm',
        'supports-[backdrop-filter]:bg-primary-600/95 supports-[backdrop-filter]:backdrop-blur',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="container flex flex-col gap-2 py-2 text-xs md:flex-row md:items-center md:justify-between md:gap-4 md:text-sm">
        <div className="flex flex-1 items-center gap-3">
          {announcement.badge && (
            <span className="inline-flex items-center rounded-lg bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-badge md:text-xs">
              {announcement.badge}
            </span>
          )}
          <p className="flex-1 text-white">{announcement.message}</p>
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          {renderAction()}
          {announcement.dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
              aria-label="Fermer l'annonce"
            >
              <span aria-hidden="true">x</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopAnnouncementBar
