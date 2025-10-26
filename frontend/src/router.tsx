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
const QuoteBuilder = React.lazy(() => import('./pages/QuoteBuilder'))
const Suppliers = React.lazy(() => import('./pages/Suppliers'))
const Inventory = React.lazy(() => import('./pages/Inventory'))
const Customers = React.lazy(() => import('./pages/Customers'))
const Invoices = React.lazy(() => import('./pages/Invoices'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Login = React.lazy(() => import('./pages/Login'))
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const MarketingHome = React.lazy(() => import('./pages/MarketingHome'))
const Resources = React.lazy(() => import('./pages/Resources'))
const Support = React.lazy(() => import('./pages/Support'))
const About = React.lazy(() => import('./pages/About'))
const Trial = React.lazy(() => import('./pages/Trial'))

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
)

const primaryNavigation: NavigationItem[] = [
  {
    id: 'solutions',
    label: 'Solutions',
    path: '/dashboard',
    sections: [
      {
        title: 'Pilotage temps reel',
        description: 'Visualisez vos indicateurs et monitorez vos equipes.',
        links: [
          { label: 'Tableau de bord', path: '/dashboard', description: 'Vue synthese des ventes et de la tresorerie.' },
          { label: 'Boutique omnicanal', path: '/storefront', description: 'Animez votre vitrine WhatsApp et Web.', badge: 'Beta' },
          { label: 'Administration equipe', path: '/admin', description: 'Controle des droits et workflows par profil.' },
        ],
      },
      {
        title: 'Operations et finances',
        description: 'Automatisez vos stocks, devis et factures.',
        links: [
          { label: 'Stocks intelligents', path: '/admin/inventory', description: 'Alertes et reapprovisionnements.' },
          { label: 'Wizard devis', path: '/admin/quotes', description: 'Transformez un devis en commande en un clic.' },
          { label: 'Facturation UEMOA', path: '/admin/invoices', description: 'Numerotation, taxes et relances.' },
        ],
      },
      {
        title: 'Onboarding express',
        description: 'Activez votre organisation en 72 heures.',
        links: [
          { label: 'Guide onboarding', path: '/ressources#onboarding', description: 'Checklist et roles a mobiliser.' },
          { label: 'Calendrier demo', path: '/essai-gratuit', description: 'Planifiez une session live avec un expert.' },
          { label: 'Support prioritaire', path: '/support', description: 'Canaux WhatsApp et email dedies.' },
        ],
      },
    ],
  },
  {
    id: 'industries',
    label: 'Industries',
    path: '/home',
    sections: [
      {
        title: 'Segments prioritaires',
        description: 'Parcours preconfigures par metier.',
        links: [
          { label: 'Commerce de detail', path: '/home#retail', description: 'Bundles encaissement + logistique.' },
          { label: 'Services B2B', path: '/home#services', description: 'Pipeline devis > contrats > factures.' },
          { label: 'Distributeurs multi sites', path: '/home#distribution', description: 'Reporting par filiale UEMOA.' },
        ],
      },
      {
        title: 'Cas regionaux',
        description: 'Adaptes aux exigences locales.',
        links: [
          { label: 'TPE Senegal', path: '/home#temoignages', description: 'Success stories sur WhatsApp Commerce.' },
          { label: 'Retail Cote d Ivoire', path: '/home#retail', description: 'Click and collect Abidjan et Bouake.' },
          { label: 'Partenaires fintech', path: '/home#partenaires', description: 'Ecosysteme waohdigital.' },
        ],
      },
      {
        title: 'Portail clients',
        description: 'Ressources cle en main pour vos clients finaux.',
        links: [
          { label: 'Kit adoption', path: '/ressources#kit', description: 'Emailings, scripts et checklists.' },
          { label: 'Ateliers industries', path: '/ressources#webinaires', description: 'Sessions live par metier.' },
          { label: 'Roadmap sectorielle', path: '/a-propos#roadmap', description: 'Feuille de route verticale.' },
        ],
      },
    ],
  },
  {
    id: 'ressources',
    label: 'Ressources',
    path: '/ressources',
    sections: [
      {
        title: 'Guides et assets',
        description: 'Materiels pour vos equipes commerciales.',
        links: [
          { label: 'Bibliotheque', path: '/ressources', description: 'Checklists, matrices et gabarits.' },
          { label: 'Webinaires mensuels', path: '/ressources#webinaires', description: 'Replays et sessions live.' },
          { label: 'Notes conformite', path: '/ressources#compliance', description: 'Synthese des normes UEMOA.' },
        ],
      },
      {
        title: 'Communautes',
        description: 'Echangez avec les pairs WLAHWLA.',
        links: [
          { label: 'Canal WhatsApp VIP', path: 'https://wa.me/221778889900', description: 'Acces support prioritaire.', external: true },
          { label: 'Forum produit', path: '/ressources#forum', description: 'Retours beta et idees roadmap.' },
          { label: 'Centre de statut', path: '/support#status', description: 'Incidents et maintenance planifiee.' },
        ],
      },
      {
        title: 'Formation',
        description: 'Montez en competence rapidement.',
        links: [
          { label: 'Academie WLAHWLA', path: '/ressources#academy', description: 'Parcours certifiant self service.' },
          { label: 'Coaching equipes', path: '/essai-gratuit', description: 'Sessions personnalisees.' },
          { label: 'Newsletter produit', path: '/ressources#newsletter', description: 'Updates et betas exclusives.' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'A propos',
    path: '/a-propos',
    sections: [
      {
        title: 'Vision et impact',
        description: 'Pourquoi WLAHWLA accelere le commerce UEMOA.',
        links: [
          { label: 'Notre manifeste', path: '/a-propos', description: 'Mission, valeurs et equipe.' },
          { label: 'Cas clients', path: '/home#temoignages', description: 'Resultats tangibles par secteur.' },
          { label: 'Agenda terrain', path: '/ressources#agenda', description: 'Salons et evenements a venir.' },
        ],
      },
      {
        title: 'Gouvernance',
        description: 'Transparence et securite de la plateforme.',
        links: [
          { label: 'Contrat UEMOA', path: '/support#securite', description: 'Normes, SLA et engagements.' },
          { label: 'Partenaires strategiques', path: '/home#partenaires', description: 'Fintech, telcos et banques.' },
          { label: 'Conformite RGPD', path: '/support#rgpd', description: 'Localisation et retention des donnees.' },
        ],
      },
      {
        title: 'Rejoindre l aventure',
        description: 'Partenaires, talents et ambassadeurs.',
        links: [
          { label: 'Programme partenaires', path: '/a-propos#partenaires', description: 'Monetisez vos reseaux.' },
          { label: 'Talents', path: '/a-propos#talents', description: 'Postes ouverts et stages.' },
          { label: 'Presse & media', path: '/a-propos#media', description: 'Dossier presse et ressources.' },
        ],
      },
    ],
  },
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
      <AdminNavLink to="/admin/quotes">Devis</AdminNavLink>
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
          ? 'border-primary-200 bg-primary-50 text-primary-700'
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
              path: 'home',
              element: withSuspense(MarketingHome),
              handle: {
                layout: {
                  title: 'Panorama WLAHWLA',
                  description:
                    'Explorez les offres marketing, les industries cibles et les retours clients directement depuis la plateforme.',
                },
              },
            },
            {
              path: 'ressources',
              element: withSuspense(Resources),
              handle: {
                layout: {
                  title: 'Centre de ressources',
                  description:
                    'Guides, checklists et replays pour accompagner vos equipes commerciales et operations.',
                },
              },
            },
            {
              path: 'support',
              element: withSuspense(Support),
              handle: {
                layout: {
                  title: 'Support et statut plateforme',
                  description:
                    'Retrouvez les canaux d assistance, l etat de service et les engagements de securite WLAHWLA.',
                },
              },
            },
            {
              path: 'a-propos',
              element: withSuspense(About),
              handle: {
                layout: {
                  title: 'A propos de WLAHWLA',
                  description:
                    'Vision, gouvernance et partenaires qui accelerent le commerce dans l espace UEMOA.',
                },
              },
            },
            {
              path: 'essai-gratuit',
              element: withSuspense(Trial),
              handle: {
                layout: {
                  title: 'Demander un essai gratuit',
                  description:
                    'Planifiez une session personnalisee avec un expert pour configurer votre environnement pilote.',
                },
              },
            },
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
                  path: 'quotes',
                  element: withSuspense(QuoteBuilder),
                  handle: {
                    layout: {
                      title: 'Wizard devis',
                      description: 'Creez des devis multi lignes et changez rapidement de statut.',
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
