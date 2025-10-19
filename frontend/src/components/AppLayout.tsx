import React from 'react'
import { Button } from './Button'
import { Badge } from './Badge'

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export type NavigationItem = {
  label: string
  path: string
  description?: string
  badge?: string
}

export type AppLayoutProps = {
  navigation: NavigationItem[]
  currentPath: string
  title: string
  description?: string
  sidebar?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

export function AppLayout({
  navigation,
  currentPath,
  title,
  description,
  sidebar,
  actions,
  children,
}: AppLayoutProps) {
  const activeNav = navigation.find((item) => currentPath.startsWith(item.path)) ?? navigation[0]

  const handleSelect = (value: string) => {
    window.location.hash = value
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface/95 backdrop-blur">
        <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-display text-xl text-white shadow-soft">
              WL
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-slate-900">WLA Invoicer</p>
              <p className="text-sm text-slate-500">Gestion simplifiee des ventes</p>
            </div>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => {
              const isActive = currentPath.startsWith(item.path)
              return (
                <Button
                  key={item.path}
                  as="a"
                  href={item.path}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="sm"
                  className={cx(
                    'px-4',
                    isActive && 'shadow-ring',
                    !isActive && 'text-slate-600 hover:text-slate-900',
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && <Badge variant="info" className="hidden md:inline-flex">{item.badge}</Badge>}
                </Button>
              )
            })}
          </nav>
          <div className="md:hidden">
            <label className="sr-only" htmlFor="app-layout-nav">
              Navigation principale
            </label>
            <div className="relative">
              <select
                id="app-layout-nav"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                value={activeNav?.path}
                onChange={(event) => handleSelect(event.target.value)}
              >
                {navigation.map((item) => (
                  <option key={item.path} value={item.path}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                v
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1>{title}</h1>
            {description && <p className="max-w-2xl text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        <div className={cx('grid gap-6', sidebar ? 'lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]' : '')}>
          {sidebar && (
            <aside className="order-2 space-y-4 lg:order-1">
              {sidebar}
            </aside>
          )}
          <main className={cx('order-1 flex flex-col gap-6', sidebar ? 'lg:order-2' : '')}>{children}</main>
        </div>
      </div>
    </div>
  )
}
