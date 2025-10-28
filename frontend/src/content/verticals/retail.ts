import type { VerticalContent } from './types'

export const retailVertical: VerticalContent = {
  slug: 'retail',
  icon: 'retail',
  title: 'Retail omnicanal',
  eyebrow: 'Commerce connecte',
  summary: 'Reliez vos boutiques physiques, WhatsApp et e-commerce sous une seule plateforme UEMOA.',
  hero: {
    heading: 'Unifiez encaissement boutique et ventes digitales',
    description:
      'Synchronisez stocks, catalogues et paiements mobile money pour ouvrir de nouveaux canaux sans perdre le controle des operations.',
    primaryCta: {
      label: 'Configurer une demo retail',
      to: '/essai-gratuit?vertical=retail',
    },
    secondaryCta: {
      label: 'Voir les packs commerces',
      to: '/storefront',
    },
  },
  metrics: [
    { label: 'Activation terrain', value: '3 semaines' },
    { label: 'Conversion panier', value: '+23 %' },
    { label: 'Temps d inventaire', value: '-35 %' },
  ],
  promise: [
    {
      title: 'Catalogue omnicanal',
      description: 'Publiez une fiche produit unique sur boutique, WhatsApp, QR code et marketplaces partenaires.',
    },
    {
      title: 'Caisse connectee',
      description: 'Encaissez en mobile money ou carte bancaire, conciliez automatiquement avec vos rapports journaliers.',
    },
    {
      title: 'Pilotage magasins',
      description: 'Suivez vos ventes par site, vendeur et canal, et automatisez les reapprovisionnements critiques.',
    },
  ],
  useCases: [
    {
      title: 'Click and collect express',
      description: 'Recevez des commandes WhatsApp, preparez en caisse et notifiez en temps reel vos clients.',
      bullets: [
        'Interface vendeur unique pour valider les paniers',
        'Stock decremente automatiquement par point de vente',
        'Notification retrait et suivi satisfaction dans Support',
      ],
    },
    {
      title: 'Campagnes drive-to-store',
      description: 'Liez panneaux waohdigital et codes promo pour mesurer la conversion magasin.',
      bullets: [
        'Segments geolocalises importes depuis CRM',
        'Suivi conversion par quartier dans dashboard retail',
        'Budget campagne ajuste par KPI en temps reel',
      ],
    },
  ],
  resources: [
    { label: 'Guide caisse connectee', to: '/ressources#onboarding' },
    { label: 'Checklist ouverture boutique', to: '/ressources#kit' },
  ],
  testimonials: [
    {
      quote: 'Nous avons aligne les ventes WhatsApp et la caisse magasin en moins d un mois. Les ruptures ont chute de 40 %.',
      author: 'Sana Boutique',
      role: 'Directrice retail Dakar',
      metric: '+18 % CA trimestriel',
    },
  ],
  preview: {
    headline: 'Activez vos boutiques physiques et WhatsApp avec inventaire unique.',
    bullets: [
      'Encaissement mobile money et carte en caisse',
      'Click and collect et livraison programmee',
      'Tableaux de bord par magasin et equipe',
    ],
    ctaLabel: 'Explorer retail',
    ctaTo: '/verticals/retail',
  },
}
