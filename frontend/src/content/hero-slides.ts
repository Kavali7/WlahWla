export type HeroSlideContent = {
  id: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  cta?: {
    label: string
    href: string
  }
  metrics?: {
    label: string
    value: string
  }[]
}

export const heroSlides: HeroSlideContent[] = [
  {
    id: 'commerce',
    label: 'Commerce omnicanal',
    title: 'Vendez, facturez et livrez sans friction',
    description: 'Unified commerce, paiements locaux et suivi temps reel sur une meme plateforme.',
    image: '/assets/brand/hero-commerce-1600x900.svg',
    imageAlt: 'Illustration neon commerce omnicanal WLAHWLA',
    cta: {
      label: 'Activer un pilote',
      href: '/essai-gratuit',
    },
    metrics: [
      { label: 'Temps d onboarding', value: '-40%' },
      { label: 'Conversion retail', value: '+23%' },
    ],
  },
  {
    id: 'services',
    label: 'Prestations expertes',
    title: 'Pilotez vos missions en temps reel',
    description: 'Flux devis > e-signature > facturation, badges conformite et portails clients.',
    image: '/assets/brand/hero-services-1600x900.svg',
    imageAlt: 'Illustration neon prestations de services digitales',
    cta: {
      label: 'Voir la demo',
      href: '/ressources#demo',
    },
    metrics: [
      { label: 'Cycle devis', value: 'x2 plus rapide' },
      { label: 'Satisfaction clients', value: '92 %' },
    ],
  },
  {
    id: 'ads',
    label: 'Campagnes publicitaires',
    title: 'Des panneaux data driven pour l UEMOA',
    description: 'Planifiez vos panneaux digitaux et faites remonter les performances ville par ville.',
    image: '/assets/brand/hero-ads-1600x900.svg',
    imageAlt: 'Illustration panneaux publicitaires digitaux',
    cta: {
      label: 'Composer une campagne',
      href: '/ressources#campagnes',
    },
    metrics: [
      { label: 'Impressions certifiees', value: '1,8M/mois' },
      { label: 'ROI moyen', value: '+18%' },
    ],
  },
]
