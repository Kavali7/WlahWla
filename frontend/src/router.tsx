import React, { Suspense } from 'react'
import { Link, NavLink, createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout, NavigationItem } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import { Button } from './components/Button'
import { Card } from './components/Card'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Storefront = React.lazy(() => import('./pages/Storefront'))
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'))
const Products = React.lazy(() => import('./pages/Products'))
const Suppliers = React.lazy(() => import('./pages/Suppliers'))
const Inventory = React.lazy(() => import('./pages/Inventory'))
const Customers = React.lazy(() => import('./pages/Customers'))
const Invoices = React.lazy(() => import('./pages/Invoices'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Login = React.lazy(() => import('./pages/Login'))
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
)

const primaryNavigation: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Boutique', path: '/storefront', badge: 'Beta' },
  { label: 'Administration', path: '/admin' },
]

const DashboardSidebar = () => (
  <>
    <Card title="Actions rapides" contentClassName="gap-3">
      <Button to="/admin" variant="secondary" size="sm" as={Link}>
        Ajouter un collaborateur
      </Button>
      <Button to="/storefront" variant="ghost" size="sm" as={Link} className="justify-start">
        Ouvrir la boutique
      </Button>
    </Card>
    <Card title="Astuce du jour" contentClassName="gap-2 text-sm text-slate-600">
      <p>
        Comparez vos ventes hebdomadaires pour anticiper les besoins de reapprovisionnement et
        maintenir vos produits phares en stock.
      </p>
    </Card>
  </>
)

const StorefrontSidebar = () => (
  <Card title="Conseils conversion" contentClassName="gap-2 text-sm text-slate-600">
    <p>
      Ajoutez une description courte et claire a chaque produit pour rassurer vos clients sur la
      disponibilite et les delais.
    </p>
    <p>
      Partagez vos paniers le soir ou tot le matin : vos clients ouvrent plus rapidement leurs messages.
    </p>
  </Card>
)

const AdminSidebar = () => (
  <div className="card px-5 py-6">
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Navigation admin</p>
    <nav className="mt-4 grid gap-2 text-sm">
      <AdminNavLink to="/admin">Equipe</AdminNavLink>
      <AdminNavLink to="/admin/products">Catalogue</AdminNavLink>
      <AdminNavLink to="/admin/inventory">Inventaire</AdminNavLink>
      <AdminNavLink to="/admin/suppliers">Fournisseurs</AdminNavLink>
      <AdminNavLink to="/admin/customers">Clients</AdminNavLink>
      <AdminNavLink to="/admin/invoices">Factures</AdminNavLink>
      <AdminNavLink to="/admin/settings">Parametres</AdminNavLink>
    </nav>
  </div>
)

const AdminNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavButton to={to}>{children}</NavButton>
)

const NavButton: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        'flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors',
        isActive
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50',
      ].join(' ')
    }
  >
    <span>{children}</span>
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">&gt;</span>
  </NavLink>
)

const AdminOutlet = () => <Outlet />

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: withSuspense(Login),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/forgot-password',
      element: withSuspense(ForgotPassword),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/reset-password',
      element: withSuspense(ResetPassword),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          element: <AppLayout navigation={primaryNavigation} />,
          errorElement: <RouteErrorBoundary />,
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            {
              path: 'dashboard',
              element: withSuspense(Dashboard),
              handle: {
                layout: {
                  title: 'Tableau de bord',
                  description: 'Visualisez la sante de votre activite a travers vos indicateurs cles.',
                  actions: (
                    <div className="flex items-center gap-2">
                      <Button to="/storefront" as={Link} variant="primary" size="sm" className="whitespace-nowrap">
                        Nouvelle commande
                      </Button>
                      <Button to="/admin" as={Link} variant="secondary" size="sm" className="whitespace-nowrap">
                        Inviter un membre
                      </Button>
                    </div>
                  ),
                  sidebar: <DashboardSidebar />,
                },
              },
            },
            {
              path: 'storefront',
              element: withSuspense(Storefront),
              handle: {
                layout: {
                  title: 'Boutique en ligne',
                  description: 'Preparez vos paniers puis partagez un lien WhatsApp a vos clients.',
                  actions: (
                    <Button to="/dashboard" as={Link} variant="secondary" size="sm">
                      Retour au tableau de bord
                    </Button>
                  ),
                  sidebar: <StorefrontSidebar />,
                },
              },
            },
            {
              path: 'admin',
              element: <AdminOutlet />,
              children: [
                {
                  index: true,
                  element: withSuspense(AdminPanel),
                  handle: {
                    layout: {
                      title: 'Gestion des equipes',
                      description: 'Controlez les acces et assurez la securite de votre organisation.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: 'products',
                  element: withSuspense(Products),
                  handle: {
                    layout: {
                      title: 'Catalogue produits',
                      description: 'Centralisez les fiches produits pour la vente et la facturation.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: 'inventory',
                  element: withSuspense(Inventory),
                  handle: {
                    layout: {
                      title: 'Suivi des stocks',
                      description: 'Analysez vos mouvements pour garantir la disponibilite des produits.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: 'suppliers',
                  element: withSuspense(Suppliers),
                  handle: {
                    layout: {
                      title: 'Fournisseurs',
                      description: 'Gerez vos partenaires d approvisionnement et leurs coordonnees.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: 'customers',
                  element: withSuspense(Customers),
                  handle: {
                    layout: {
                      title: 'Annuaire clients',
                      description: 'Maintenez un portefeuille client a jour pour booster vos campagnes.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: 'invoices',
                  element: withSuspense(Invoices),
                  handle: {
                    layout: {
                      title: 'Factures',
                      description: 'Suivez vos factures, paiements et relances au meme endroit.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: 'settings',
                  element: withSuspense(Settings),
                  handle: {
                    layout: {
                      title: 'Parametres de l\'organisation',
                      description: 'Adaptez les reglages de votre entreprise et de vos workflows.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
                {
                  path: '*',
                  element: withSuspense(NotFound),
                  handle: {
                    layout: {
                      title: 'Page introuvable',
                      description: 'La section admin demandee est introuvable.',
                      sidebar: <AdminSidebar />,
                    },
                  },
                },
              ],
            },
            {
              path: '*',
              element: withSuspense(NotFound),
              handle: {
                layout: {
                  title: 'Page introuvable',
                  description: 'Verifiez l URL saisie ou revenez vers les pages principales.',
                },
              },
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: withSuspense(NotFound),
    },
  ],
  {
    basename: '/',
  },
)
