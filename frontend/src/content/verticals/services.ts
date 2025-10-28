import type { VerticalContent } from './types'

export const servicesVertical: VerticalContent = {
  slug: 'services',
  icon: 'services',
  title: 'Prestations de services',
  eyebrow: 'Operations client',
  summary: 'Standardisez vos missions juridiques, logistiques ou consulting avec un portail client actif.',
  hero: {
    heading: 'Orchestrez vos missions et signatures sans friction',
    description:
      'Du devis a la facture finale, suivez chaque prestation, automatisez les relances et offrez a vos clients un espace de suivi.',
    primaryCta: {
      label: 'Demander un atelier prestations',
      to: '/essai-gratuit?vertical=services',
    },
    secondaryCta: {
      label: 'Voir le portail client',
      to: '/home#services-parcours',
    },
  },
  metrics: [
    { label: 'Temps confirmation mission', value: '-50 %' },
    { label: 'Satisfaction client', value: '+21 pts' },
    { label: 'Documents signes', value: '100 % numerique' },
  ],
  promise: [
    {
      title: 'Workflow mission',
      description: 'Configurez et segmentez vos prestations par phase avec jalons, dependances et notifications.',
    },
    {
      title: 'Portail client dedie',
      description: 'Vos clients deposent documents, signent en ligne et consultent la facturation en temps reel.',
    },
    {
      title: 'Reporting SLA',
      description: 'Mesurez delais, satisfaction et marge par mission pour vos comites de pilotage.',
    },
  ],
  useCases: [
    {
      title: 'Cabinet juridique digitalise',
      description: 'Centralisez dossiers, decisions et signatures avec partage securise.',
      bullets: [
        'Templates d actes et contrats standardises',
        'Historique interactions et piste de validation',
        'Facturation automatique a la cloture du dossier',
      ],
    },
    {
      title: 'Prestataire logistique',
      description: 'Automatisez demandes, planning de livraison et facturation par lot.',
      bullets: [
        'Portail client pour suivre expedition',
        'Integration IoT ou CSV pour confirmation livraison',
        'Factures groupees et relances planifiees',
      ],
    },
  ],
  resources: [
    { label: 'Guide portail client', to: '/ressources#kit' },
    { label: 'Template SLA services', to: '/ressources#onboarding' },
  ],
  testimonials: [
    {
      quote: 'Le portail client a fait grimper notre taux de signature en moins de 48 heures apres envoi.',
      author: 'Lexa Conseil',
      role: 'Responsable operations',
      metric: '+32 % contrats signes',
    },
  ],
  preview: {
    headline: 'Suivez vos missions et signatures dans un seul portail collaboratif.',
    bullets: [
      'Workflow personnalise par type de prestation',
      'Portail client avec notifications',
      'Reporting SLA et satisfaction integres',
    ],
    ctaLabel: 'Explorer prestations',
    ctaTo: '/verticals/services',
  },
}
