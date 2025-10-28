export type ServiceId = 'commerce' | 'billing' | 'campaigns' | 'support'

export type ServiceOffering = {
  id: ServiceId
  icon: ServiceId
  title: string
  summary: string
  bullets: string[]
  cta: {
    label: string
    to: string
  }
}

export const services: ServiceOffering[] = [
  {
    id: 'commerce',
    icon: 'commerce',
    title: 'Commerce omnicanal',
    summary: 'Animez boutique, WhatsApp et marketplaces avec inventaire unifie et paiement instantane.',
    bullets: [
      'Catalogue synchronise web + WhatsApp + USSD',
      'Encaissement mobile money et cartes en 1 clic',
      'Scenario click and collect avec suivi livraison',
    ],
    cta: {
      label: 'Configurer mes ventes',
      to: '/storefront',
    },
  },
  {
    id: 'billing',
    icon: 'billing',
    title: 'Facturation et conformite',
    summary: 'Numerotation UEMOA, TVA multi pays et relances automatisees pour les equipes finance.',
    bullets: [
      'Assistant devis > contrat > facture',
      'Gestion des retenues, TVA et acomptes',
      'Relances WhatsApp, email et portails clients',
    ],
    cta: {
      label: 'Voir les workflows',
      to: '/admin/invoices',
    },
  },
  {
    id: 'campaigns',
    icon: 'campaigns',
    title: 'Campagnes publicitaires',
    summary: 'Activez waohdigital media: ciblage quartier, panneaux OOH et automatisation WhatsApp.',
    bullets: [
      'Brief centralise avec templates sectoriels',
      'Segmentation geolocalisee et audiences CRM',
      'Dashboard ROI reliant ventes et impressions',
    ],
    cta: {
      label: 'Planifier une campagne',
      to: '/ressources#webinaires',
    },
  },
  {
    id: 'support',
    icon: 'support',
    title: 'Support et analytics',
    summary: 'Portail support prioritaire, base de connaissances et analytics temps reel par filiale.',
    bullets: [
      'Playbooks adoption par metier et pays',
      'Support WhatsApp VIP 7j/7',
      'Analyses consolidees pour comite de direction',
    ],
    cta: {
      label: 'Acceder au support',
      to: '/support',
    },
  },
]
