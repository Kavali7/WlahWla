import React, { useMemo } from 'react'
import { NavLink, Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'
import { Badge } from './Badge'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'

export type NavigationItem = {
  label: string
  path: string
  badge?: string
}

type LayoutMetadata = {
  title: string
  description?: string
  sidebar?: React.ReactNode
  actions?: React.ReactNode
}

type LayoutHandle = {
  layout?: LayoutMetadata
}

export type AppLayoutProps = {
  navigation: NavigationItem[]
}

const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const fallbackLayout: LayoutMetadata = {
  title: 'Tableau de bord',
  description: 'Visualisez la sante de votre activite.',
}

export function AppLayout({ navigation }: AppLayoutProps) {
  const matches = useMatches()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, organization, organizations, setOrganization, logout } = useAuth()

  const layout =
    [...matches]
      .reverse()
      .map((match) => (match.handle as LayoutHandle | undefined)?.layout)
      .find(Boolean) ?? fallbackLayout

  const activePath =
    navigation.find((item) => location.pathname.startsWith(item.path))?.path ?? navigation[0]?.path ?? '/'

  const displayName = useMemo(() => user?.name || user?.email || 'Utilisateur', [user])

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setOrganization(value.length ? value : null)
  }

  const handleLogout = () => {
    logout().catch(() => undefined)
  }

  const renderUserMenu = (variant: 'desktop' | 'mobile') => (
    <div
      className={classNames(
        'items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm',
        variant === 'desktop' ? 'hidden md:flex' : 'flex w-full justify-between md:hidden',
      )}
    >
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-slate-900">{displayName}</span>
        {organizations.length > 1 ? (
          <select
            className="mt-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={organization?.id ?? ''}
            onChange={handleOrganizationChange}
          >
            <option value="">Organisation</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name ?? 'Organisation'}
              </option>
            ))}
          </select>
        ) : (
          organization?.name && <span className="text-xs text-slate-500">{organization.name}</span>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Se deconnecter
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface/95 backdrop-blur">
        <div className="container flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-display text-xl text-white shadow-soft">
                WL
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-slate-900">WLA Invoicer</p>
                <p className="text-sm text-slate-500">Gestion simplifiee des ventes</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <nav className="hidden items-center gap-2 md:flex">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      classNames(
                        'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
                        isActive
                          ? 'border-transparent bg-brand-500 text-white shadow-soft'
                          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50',
                      )
                    }
                  >
                    <span>{item.label}</span>
                    {item.badge && <Badge variant="info" className="hidden md:inline-flex">{item.badge}</Badge>}
                  </NavLink>
                ))}
              </nav>
              {renderUserMenu('desktop')}
            </div>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <div className="relative flex-1">
              <label className="sr-only" htmlFor="app-layout-nav">
                Navigation principale
              </label>
              <div className="relative">
                <select
                  id="app-layout-nav"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  value={activePath}
                  onChange={(event) => {
                    navigate(event.target.value)
                  }}
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
            {renderUserMenu('mobile')}
          </div>
        </div>
      </header>

      <div className="container flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1>{layout.title}</h1>
            {layout.description && <p className="max-w-2xl text-sm text-slate-500">{layout.description}</p>}
          </div>
          {layout.actions && <div className="flex items-center gap-2">{layout.actions}</div>}
        </div>

        <div
          className={classNames(
            'grid gap-6',
            layout.sidebar ? 'lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]' : '',
          )}
        >
          {layout.sidebar && <aside className="order-2 space-y-4 lg:order-1">{layout.sidebar}</aside>}
          <main className={classNames('order-1 flex flex-col gap-6', layout.sidebar ? 'lg:order-2' : '')}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
