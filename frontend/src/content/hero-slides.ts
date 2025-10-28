export type HeroSlideContent = {
  id: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  primaryCta?: {
    label: string
    href: string
    external?: boolean
  }
  secondaryCta?: {
    label: string
    href: string
    external?: boolean
  }
  tertiaryCta?: {
    label: string
    href: string
    external?: boolean
  }
  metrics?: {
    label: string
    value: string
  }[]
  trustBadges?: string[]
}

const whatsAppTrial = 'https://wa.me/221778889900?text=Bonjour%20WLAHWLA%2C%20pouvons-nous%20planifier%20une%20demo%20?' as const

export const heroSlides: HeroSlideContent[] = [
  {
    id: 'commerce',
    label: 'Suite commerce UEMOA',
    title: 'Unifiez ventes, stock et factures en temps reel',
    description:
      'Pilotez boutiques, WhatsApp et deliveries depuis un cockpit unique aligne sur les normes fiscales et bancaires locales.',
    image: '/assets/brand/hero-commerce-1600x900.svg',
    imageAlt: 'Illustration neon commerce omnicanal WLAHWLA',
    primaryCta: {
      label: 'Essayer gratuitement',
      href: '/essai-gratuit',
    },
    secondaryCta: {
      label: 'Voir la demo',
      href: '/ressources#demo',
    },
    tertiaryCta: {
      label: 'WhatsApp',
      href: whatsAppTrial,
      external: true,
    },
    metrics: [
      { label: 'Activation', value: '72 h' },
      { label: 'Conversion retail', value: '+23 %' },
      { label: 'Temps de caisse', value: '-35 %' },
    ],
    trustBadges: ['Certifie e-facturation UEMOA', 'Reconciliations banques quotidiennes'],
  },
  {
    id: 'services',
    label: 'Prestations expertes',
    title: 'Accelez devis, contrats et facturation',
    description:
      'Automatisez workflows signature, suivi mission et relances finance pour vos equipes services et cabinets conseil.',
    image: '/assets/brand/hero-services-1600x900.svg',
    imageAlt: 'Illustration neon prestations de services digitales',
    primaryCta: {
      label: 'Essayer gratuitement',
      href: '/essai-gratuit',
    },
    secondaryCta: {
      label: 'Voir la demo',
      href: '/ressources#demo',
    },
    tertiaryCta: {
      label: 'WhatsApp',
      href: 'https://wa.me/221778889900?text=Bonjour%20WLAHWLA%2C%20je%20veux%20une%20demo%20services.',
      external: true,
    },
    metrics: [
      { label: 'Cycle devis', value: '-58 %' },
      { label: 'Satisfaction client', value: '92 %' },
      { label: 'Dossiers signes', value: '100 % numeriques' },
    ],
    trustBadges: ['Signatures legale eIDAS-ready', 'Portail client securise TLS1.3'],
  },
  {
    id: 'ads',
    label: 'Campagnes publicitaires',
    title: 'Mesurez vos panneaux ville par ville',
    description:
      'Combinez panneaux waohdigital, ciblage geolocalise et rapports temps reel pour piloter chaque campagne retail ou B2B.',
    image: '/assets/brand/hero-ads-1600x900.svg',
    imageAlt: 'Illustration panneaux publicitaires digitaux',
    primaryCta: {
      label: 'Essayer gratuitement',
      href: '/essai-gratuit',
    },
    secondaryCta: {
      label: 'Voir la demo',
      href: '/ressources#demo',
    },
    tertiaryCta: {
      label: 'WhatsApp',
      href: 'https://wa.me/221778889900?text=Bonjour%20WLAHWLA%2C%20parlons%20campagnes%20publicitaires.',
      external: true,
    },
    metrics: [
      { label: 'Impressions certifiees', value: '1.8 M / mois' },
      { label: 'ROI moyen', value: '+18 %' },
      { label: 'Reporting', value: '5 min' },
    ],
    trustBadges: ['Audits tiers Nielsen 2025', 'Connecte aux telcos partenaires'],
  },
]
