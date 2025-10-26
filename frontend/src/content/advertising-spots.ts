export type AdvertisingSpot = {
  id: string
  badge: string
  title: string
  description: string
  image: string
  imageAlt: string
  stats?: Array<{
    label: string
    value: string
  }>
  cta?: {
    label: string
    href: string
  }
}

export const advertisingSpots: AdvertisingSpot[] = [
  {
    id: 'analytics',
    badge: 'Analytics temps reel',
    title: 'Audience et conversions par quartier',
    description: 'Connectez vos panneaux OOH aux ventes commerce pour mesurer le ROI omni-canal.',
    image: '/assets/brand/panel-analytics-640x480.svg',
    imageAlt: 'Graphiques neon sur panneau publicitaire',
    stats: [
      { label: 'Conversion moyenne', value: '+18 %' },
      { label: 'Segments actifs', value: '12 industries' },
    ],
    cta: {
      label: 'Configurer le dashboard',
      href: '/ressources#analytics',
    },
  },
  {
    id: 'cross-sell',
    badge: 'Panneaux combo',
    title: 'Activez vos banners cross sell',
    description: 'Combinez cartes de fidelite WhatsApp, QR code magasin et panneaux geolocalises.',
    image: '/assets/brand/panel-cross-sell-640x480.svg',
    imageAlt: 'Panneau publicitaire moderne avec CTA',
    stats: [
      { label: 'Campagnes pilote', value: '36 en cours' },
      { label: 'Boost panier moyen', value: '+23 %' },
    ],
    cta: {
      label: 'Planifier une campagne',
      href: '/support#campagnes',
    },
  },
]
