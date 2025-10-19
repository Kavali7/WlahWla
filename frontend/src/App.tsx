import React from 'react'
import Dashboard from './pages/Dashboard'
import Storefront from './pages/Storefront'
import AdminPanel from './pages/AdminPanel'
import { AppLayout, NavigationItem } from './components/AppLayout'
import { Card } from './components/Card'
import { Button } from './components/Button'

type RouteConfig = {
  path: string
  label: string
  title: string
  description: string
  badge?: string
  Component: React.ComponentType
  sidebar?: React.ReactNode
  actions?: React.ReactNode
}

const ROUTES: RouteConfig[] = [
  {
    path: '#/dashboard',
    label: 'Dashboard',
    title: 'Tableau de bord',
    description: 'Visualisez la sante de votre activite a travers vos indicateurs cles.',
    badge: 'Live',
    Component: Dashboard,
    actions: (
      <div className="flex items-center gap-2">
        <Button as="a" href="#/store" variant="primary" size="sm" className="whitespace-nowrap">
          Nouvelle commande
        </Button>
        <Button as="a" href="#/admin" variant="secondary" size="sm" className="whitespace-nowrap">
          Inviter un membre
        </Button>
      </div>
    ),
    sidebar: (
      <>
        <Card title="Actions rapides" contentClassName="gap-3">
          <Button as="a" href="#/admin" variant="secondary" size="sm">
            Ajouter un collaborateur
          </Button>
          <Button as="a" href="#/store" variant="ghost" size="sm" className="justify-start">
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
    ),
  },
  {
    path: '#/store',
    label: 'Boutique',
    title: 'Boutique en ligne',
    description: 'Preparez vos paniers puis partagez un lien WhatsApp a vos clients.',
    badge: 'Beta',
    Component: Storefront,
    actions: (
      <Button as="a" href="#/dashboard" variant="secondary" size="sm">
        Retour au tableau de bord
      </Button>
    ),
    sidebar: (
      <Card title="Conseils conversion" contentClassName="gap-2 text-sm text-slate-600">
        <p>
          Ajoutez une description courte et claire a chaque produit pour rassurer vos clients sur la
          disponibilite et les delais.
        </p>
        <p>
          Partagez vos paniers le soir ou tot le matin : vos clients ouvrent plus rapidement leurs
          messages.
        </p>
      </Card>
    ),
  },
  {
    path: '#/admin',
    label: 'Administration',
    title: 'Gestion des equipes',
    description: 'Controlez les acces et assurez la securite de votre organisation.',
    Component: AdminPanel,
    sidebar: (
      <>
        <Card title="Checklist securite" contentClassName="gap-2 text-sm text-slate-600">
          <ul className="list-disc space-y-2 pl-4">
            <li>Actualisez les droits d'acces des membres inactifs tous les trimestres.</li>
            <li>Utilisez des adresses professionnelles pour faciliter la gestion des comptes.</li>
          </ul>
        </Card>
        <Card title="Bonnes pratiques" contentClassName="gap-2 text-sm text-slate-600">
          <p>Creez des roles distincts pour la vente, la finance et l'inventaire.</p>
          <p>Documentez chaque nouveau processus pour faciliter l'onboarding des futurs membres.</p>
        </Card>
      </>
    ),
  },
]

const navigation: NavigationItem[] = ROUTES.map(({ path, label, badge }) => ({ path, label, badge }))

const getInitialRoute = () => window.location.hash || ROUTES[0].path

export default function App() {
  const [route, setRoute] = React.useState<string>(getInitialRoute)

  React.useEffect(() => {
    const onHashChange = () => setRoute(getInitialRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const currentRoute = ROUTES.find((item) => route.startsWith(item.path)) ?? ROUTES[0]
  const CurrentComponent = currentRoute.Component

  return (
    <AppLayout
      navigation={navigation}
      currentPath={route}
      title={currentRoute.title}
      description={currentRoute.description}
      sidebar={currentRoute.sidebar}
      actions={currentRoute.actions}
    >
      <CurrentComponent />
    </AppLayout>
  )
}
