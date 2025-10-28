import type { VerticalContent } from './types'

export const agenciesVertical: VerticalContent = {
  slug: 'agencies',
  icon: 'agencies',
  title: 'Agences marketing',
  eyebrow: 'Media et performance',
  summary: 'Packager vos offres waohdigital media avec reporting live et coordination commerciale.',
  hero: {
    heading: 'Synchronisez campagnes et preuves de performance',
    description:
      'Alignez briefs, activations et rapports pour deployer des campagnes drive-to-store et digitales avec chiffre a l appui.',
    primaryCta: {
      label: 'Programmer une session agence',
      to: '/essai-gratuit?vertical=agencies',
    },
    secondaryCta: {
      label: 'Voir les cartes publicitaires',
      to: '/home#campagnes',
    },
  },
  metrics: [
    { label: 'Temps mise en ligne campagne', value: '-60 %' },
    { label: 'ROI moyen observe', value: '+18 %' },
    { label: 'Briefs centralises', value: '100 %' },
  ],
  promise: [
    {
      title: 'Brief centralise',
      description: 'Structurez vos demandes clients, validez budgets et canalisez les assets creatives dans un hub unique.',
    },
    {
      title: 'Activation waohdigital',
      description: 'Planifiez vos panneaux OOH, campagnes WhatsApp et bannieres digitales dans un meme cockpit.',
    },
    {
      title: 'Reporting live',
      description: 'Exposez KPI real time et exportez des rapports marques agence avec vos couleurs.',
    },
  ],
  useCases: [
    {
      title: 'Campagnes drive-to-store multilieux',
      description: 'Activez panneaux geolocalises et sequences WhatsApp personnalisees pour chaque zone cible.',
      bullets: [
        'Segments CRM importes et nettoyes',
        'Attribution via codes promo et QR',
        'Rapports partages avec le client final',
      ],
    },
    {
      title: 'Programme fidelite agence',
      description: 'Animez un calendrier de campagnes pour vos comptes majeurs avec previsions budgetaires.',
      bullets: [
        'Roadmap trimestrielle agence',
        'Alertes sur budgets et objectifs',
        'Bibliotheque d assets approuves',
      ],
    },
  ],
  resources: [
    { label: 'Kit campagne waohdigital', to: '/home#campagnes' },
    { label: 'Template rapport agence', to: '/ressources#webinaires' },
  ],
  testimonials: [
    {
      quote:
        'Nos clients voient leurs ventes progresser parce que nous avons enfin des rapports realtime relies aux ventes commerce.',
      author: 'Studio Neon',
      role: 'Directeur media',
      metric: '+26 % upsell',
    },
  ],
  preview: {
    headline: 'Pilotez vos campagnes waohdigital et prouve la performance en direct.',
    bullets: [
      'Briefs et assets centralises',
      'Activation OOH + WhatsApp combinee',
      'Rapports ROI marques agence',
    ],
    ctaLabel: 'Explorer agences',
    ctaTo: '/verticals/agencies',
  },
}
