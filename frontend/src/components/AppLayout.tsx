import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatches, useSearchParams } from 'react-router-dom'
import { Badge } from './Badge'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'
import OrganizationOnboardingCard from './OrganizationOnboarding'
import TopAnnouncementBar, { AnnouncementConfig } from './TopAnnouncementBar'
import announcementConfig from '../config/announcement.json'

export type NavigationLink = {
  label: string
  path: string
  description?: string
  badge?: string
  external?: boolean
}

export type NavigationSection = {
  title: string
  description?: string
  links: NavigationLink[]
}

export type NavigationItem = {
  id: string
  label: string
  path: string
  badge?: string
  sections?: NavigationSection[]
  featured?: NavigationLink
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

const focusableSelector = 'a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])'
const isBrowser = typeof window !== 'undefined'

const fallbackLayout: LayoutMetadata = {
  title: 'Tableau de bord',
  description: 'Visualisez la sante de votre activite.',
}

const ANNOUNCEMENT: AnnouncementConfig | null =
  announcementConfig && typeof announcementConfig === 'object'
    ? (announcementConfig as AnnouncementConfig)
    : null

const WhatsappGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={classNames(
      'flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-[10px] font-bold uppercase text-white shadow-sm',
      className,
    )}
    aria-hidden="true"
  >
    WA
  </span>
)

export function AppLayout({ navigation }: AppLayoutProps) {
  const matches = useMatches()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, organization, organizations, setOrganization, logout } = useAuth()
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})
  const megaCloseTimeout = useRef<number | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null)

  const layout =
    [...matches]
      .reverse()
      .map((match) => (match.handle as LayoutHandle | undefined)?.layout)
      .find(Boolean) ?? fallbackLayout

  const displayName = useMemo(() => user?.name || user?.email || 'Utilisateur', [user])

  const closeMegaMenu = () => {
    if (megaCloseTimeout.current && isBrowser) {
      window.clearTimeout(megaCloseTimeout.current)
      megaCloseTimeout.current = null
    }
    setActiveMega(null)
  }

  const scheduleMegaClose = () => {
    if (!isBrowser) return
    if (megaCloseTimeout.current) {
      window.clearTimeout(megaCloseTimeout.current)
    }
    megaCloseTimeout.current = window.setTimeout(() => {
      setActiveMega(null)
    }, 120)
  }

  const cancelMegaClose = () => {
    if (megaCloseTimeout.current && isBrowser) {
      window.clearTimeout(megaCloseTimeout.current)
      megaCloseTimeout.current = null
    }
  }

  const closeMobileMenu = (refocusToggle?: boolean) => {
    setMobileMenuOpen(false)
    if (refocusToggle && isBrowser) {
      window.setTimeout(() => mobileToggleRef.current?.focus(), 0)
    }
  }

  const toggleMobileSection = (id: string) => {
    setMobileExpanded((previous) => ({
      ...previous,
      [id]: !previous[id],
    }))
  }

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setOrganization(value.length ? value : null)
  }

  const handleLogout = () => {
    logout().catch(() => undefined)
  }

  useEffect(() => {
    if (!organizations.length) return
    const requested = searchParams.get('org')
    if (!requested) return
    const match =
      organizations.find((org) => org.code === requested || String(org.id) === requested) ?? null
    if (match && String(match.id) !== String(organization?.id ?? '')) {
      setOrganization(String(match.id))
    }
  }, [organization?.id, organizations, searchParams, setOrganization])

  useEffect(() => {
    const currentCode = organization?.code ?? (organization?.id ? String(organization.id) : null)
    const existing = searchParams.get('org')
    if (currentCode) {
      if (existing !== currentCode) {
        const params = new URLSearchParams(searchParams)
        params.set('org', currentCode)
        setSearchParams(params, { replace: true })
      }
    } else if (existing) {
      const params = new URLSearchParams(searchParams)
      params.delete('org')
      setSearchParams(params, { replace: true })
    }
  }, [organization, searchParams, setSearchParams])

  useEffect(() => {
    closeMegaMenu()
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileExpanded({})
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) {
      if (isBrowser) {
        document.body.style.removeProperty('overflow')
      }
      return
    }

    if (isBrowser) {
      document.body.style.setProperty('overflow', 'hidden')
    }

    const container = mobileMenuRef.current
    if (!container) return

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled'),
      )

    const focusable = getFocusable()
    focusable[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMobileMenu(true)
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const nodes = getFocusable()
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      if (isBrowser) {
        document.body.style.removeProperty('overflow')
      }
    }
  }, [mobileMenuOpen])

  const renderUserMenu = (variant: 'desktop' | 'mobile') => (
    <div
      className={classNames(
        'items-center gap-3 rounded-xl border border-surface-outline bg-white px-3 py-2 shadow-sm',
        variant === 'desktop' ? 'hidden xl:flex' : 'flex w-full justify-between xl:hidden',
      )}
    >
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-secondary-800">{displayName}</span>
        {organizations.length > 1 ? (
          <select
            className="mt-1 rounded-lg border border-surface-outline bg-white px-2 py-1 text-xs text-neutral-600 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
          organization?.name && <span className="text-xs text-neutral-500">{organization.name}</span>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Se deconnecter
      </Button>
    </div>
  )

  const isItemActive = (item: NavigationItem) => {
    const cleanPath = item.path.split('#')[0]
    const hasHash = item.path.includes('#')
    if (hasHash) {
      const [base, hash] = item.path.split('#')
      return location.pathname === (base.length ? base : location.pathname) && location.hash === `#${hash}`
    }
    if (location.pathname === cleanPath) return true
    if (cleanPath !== '/' && location.pathname.startsWith(cleanPath)) return true
    if (item.sections?.length) {
      return item.sections.some((section) =>
        section.links.some((link) => {
          if (link.external || !link.path) return false
          const linkBase = link.path.split('#')[0]
          return location.pathname.startsWith(linkBase)
        }),
      )
    }
    return false
  }

  const renderMegaMenu = () => {
    if (!activeMega) return null
    const item = navigation.find((entry) => entry.id === activeMega)
    if (!item || !item.sections?.length) return null

    return (
      <div
        className="absolute inset-x-0 top-full hidden lg:block"
        onMouseEnter={cancelMegaClose}
        onMouseLeave={scheduleMegaClose}
      >
        <div className="container">
          <div className="mt-3 rounded-2xl border border-surface-outline bg-white p-6 shadow-floating">
            <div className="grid gap-6 lg:grid-cols-3">
              {item.sections.map((section) => (
                <div key={`${item.id}-${section.title}`} className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold text-secondary-700">{section.title}</p>
                    {section.description && (
                      <p className="mt-1 text-sm text-neutral-600">{section.description}</p>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => {
                      const linkClasses =
                        'group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2 transition hover:border-surface-outline hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

                      const content = (
                        <>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-secondary-800 group-hover:text-primary-700">
                                {link.label}
                              </span>
                              {link.badge && <Badge variant="info">{link.badge}</Badge>}
                            </div>
                            {link.description && (
                              <span className="text-xs text-neutral-500">{link.description}</span>
                            )}
                          </div>
                          <span aria-hidden="true" className="ml-auto text-base text-neutral-400 group-hover:text-primary-600">
                            {'->'}
                          </span>
                        </>
                      )

                      return (
                        <li key={`${section.title}-${link.label}`}>
                          {link.external ? (
                            <a
                              href={link.path}
                              className={linkClasses}
                              target="_blank"
                              rel="noreferrer"
                              onClick={closeMegaMenu}
                            >
                              {content}
                            </a>
                          ) : (
                            <NavLink to={link.path} className={linkClasses} onClick={closeMegaMenu}>
                              {content}
                            </NavLink>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMobileMenu = () => {
    if (!mobileMenuOpen) return null

    return (
      <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Fermer le menu mobile"
          className="absolute inset-0 bg-secondary-900/50 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          onClick={() => closeMobileMenu(true)}
        />
        <div
          ref={mobileMenuRef}
          id="app-layout-mobile-menu"
          className="relative ml-auto flex h-full w-full max-w-sm flex-col gap-6 overflow-y-auto bg-white px-6 py-6 shadow-floating"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Menu</p>
            <button
              type="button"
              onClick={() => closeMobileMenu(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-surface-outline px-3 py-2 text-sm font-semibold text-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">x</span>
              <span>Fermer</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              as={Link}
              to="/essai-gratuit"
              variant="primary"
              size="md"
              onClick={() => closeMobileMenu(true)}
            >
              Essai gratuit
            </Button>
            <a
              className="inline-flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-semibold text-success-700 hover:bg-success-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-300 focus-visible:ring-offset-2"
              href="https://wa.me/221778889900"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsappGlyph />
              <span>WhatsApp</span>
            </a>
          </div>

          <nav className="flex flex-col gap-3">
            {navigation.map((item) => {
              const hasSections = Boolean(item.sections?.length)

              if (!hasSections) {
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className="flex items-center justify-between rounded-2xl border border-surface-outline bg-surface-subtle px-4 py-3 text-sm font-semibold text-secondary-800 hover:text-primary-700"
                    onClick={() => closeMobileMenu(true)}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">{'->'}</span>
                  </NavLink>
                )
              }

              const expanded = mobileExpanded[item.id] ?? false

              return (
                <div key={item.id} className="rounded-2xl border border-surface-outline bg-surface-subtle">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-secondary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle"
                    aria-expanded={expanded}
                    onClick={() => toggleMobileSection(item.id)}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="text-base text-neutral-500">
                      {expanded ? '-' : '+'}
                    </span>
                  </button>
                  <div
                    className={classNames(
                      'space-y-3 border-t border-surface-outline px-4 pb-4 pt-3',
                      expanded ? 'block' : 'hidden',
                    )}
                  >
                    {item.sections?.map((section) => (
                      <div key={`${item.id}-${section.title}`} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          {section.title}
                        </p>
                        <ul className="space-y-1">
                          {section.links.map((link) => (
                            <li key={`${section.title}-${link.label}`}>
                              {link.external ? (
                              <a
                                href={link.path}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-secondary-700 hover:text-primary-700"
                                onClick={() => closeMobileMenu(true)}
                              >
                                <span>{link.label}</span>
                                <span aria-hidden="true">{'->'}</span>
                              </a>
                              ) : (
                                <NavLink
                                  to={link.path}
                                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-secondary-700 hover:text-primary-700"
                                  onClick={() => closeMobileMenu(true)}
                                >
                                  <span>{link.label}</span>
                                  <span aria-hidden="true">{'->'}</span>
                                </NavLink>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="border-t border-surface-outline pt-4">
            <NavLink
              to="/support"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-700 hover:text-primary-700"
              onClick={() => closeMobileMenu(true)}
            >
              Support
              <span aria-hidden="true">{'->'}</span>
            </NavLink>
          </div>

          {renderUserMenu('mobile')}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="sticky top-0 z-50">
        <TopAnnouncementBar announcement={ANNOUNCEMENT} />
        <div className="relative border-b border-surface-outline bg-white/95 supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:backdrop-blur">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex flex-1 items-center gap-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 font-display text-xl text-white shadow-floating">
                  WL
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent-400 blur-[0.5px]" />
                  <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-accent-400/70 blur-sm" />
                </span>
                <div className="hidden flex-col sm:flex">
                  <span className="font-display text-lg font-semibold text-secondary-800">WLA Invoicer</span>
                  <span className="text-xs text-neutral-500">Suite commerciale UEMOA</span>
                </div>
              </Link>
              <nav
                className="hidden items-center gap-1 lg:flex"
                onMouseLeave={scheduleMegaClose}
              >
                {navigation.map((item) => {
                  const hasSections = Boolean(item.sections?.length)
                  const active = isItemActive(item)
                  if (hasSections) {
                    return (
                      <div key={item.id} className="relative">
                        <button
                          type="button"
                          className={classNames(
                            'group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                            active ? 'bg-primary-50 text-primary-700 shadow-floating' : 'text-secondary-700 hover:bg-surface-subtle',
                          )}
                          aria-expanded={activeMega === item.id}
                          onMouseEnter={() => {
                            cancelMegaClose()
                            setActiveMega(item.id)
                          }}
                          onFocus={() => {
                            cancelMegaClose()
                            setActiveMega(item.id)
                          }}
                          onClick={() => setActiveMega((previous) => (previous === item.id ? null : item.id))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                              event.preventDefault()
                              closeMegaMenu()
                            }
                          }}
                        >
                          <span>{item.label}</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              'text-xs transition-transform',
                              activeMega === item.id ? 'rotate-180' : '',
                            )}
                          >
                            v
                          </span>
                          {item.badge && <Badge variant="info">{item.badge}</Badge>}
                        </button>
                      </div>
                    )
                  }
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onMouseEnter={closeMegaMenu}
                      className={({ isActive }) =>
                        classNames(
                          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                          isActive || active
                            ? 'bg-primary-50 text-primary-700 shadow-floating'
                            : 'text-secondary-700 hover:bg-surface-subtle',
                        )
                      }
                    >
                      <span>{item.label}</span>
                      {item.badge && <Badge variant="info">{item.badge}</Badge>}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
            <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  classNames(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                    isActive ? 'bg-surface-subtle text-primary-700' : 'text-secondary-600 hover:bg-surface-subtle',
                  )
                }
              >
                Support
              </NavLink>
              <Button as={Link} to="/essai-gratuit" variant="primary" size="sm">
                Essai gratuit
              </Button>
              <a
                className="inline-flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-4 py-2 text-sm font-semibold text-success-700 hover:bg-success-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-300 focus-visible:ring-offset-2"
                href="https://wa.me/221778889900"
                target="_blank"
                rel="noreferrer"
                aria-label="Parler avec un conseiller WhatsApp"
              >
                <WhatsappGlyph />
                <span>WhatsApp</span>
              </a>
              {renderUserMenu('desktop')}
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 lg:hidden">
              <a
                className="inline-flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-3 py-2 text-sm font-semibold text-success-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-300 focus-visible:ring-offset-2"
                href="https://wa.me/221778889900"
                target="_blank"
                rel="noreferrer"
                aria-label="Parler avec un conseiller WhatsApp"
              >
                <WhatsappGlyph />
                <span>WhatsApp</span>
              </a>
              <button
                ref={mobileToggleRef}
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                aria-controls="app-layout-mobile-menu"
                className="inline-flex items-center gap-2 rounded-xl border border-surface-outline px-3 py-2 text-sm font-semibold text-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Menu</span>
              </button>
            </div>
          </div>
          {renderMegaMenu()}
        </div>
      </header>

      {renderMobileMenu()}

      <div className="container flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1>{layout.title}</h1>
            {layout.description && <p className="max-w-2xl text-sm text-neutral-600">{layout.description}</p>}
          </div>
          {layout.actions && <div className="flex items-center gap-2">{layout.actions}</div>}
        </div>

        <OrganizationOnboardingCard />

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

export default AppLayout
