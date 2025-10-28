import type { VerticalContent } from './types'

export const accountingVertical: VerticalContent = {
  slug: 'accounting',
  icon: 'accounting',
  title: 'PME comptables',
  eyebrow: 'Finance et conformite',
  summary: 'Accelez la production de pieces, rapprochements et declaratifs pour vos clients UEMOA.',
  hero: {
    heading: 'Automatisez factures, retenues et relances',
    description:
      'WLAHWLA fournit un workflow bout en bout pour transformer un devis en facture, appliquer les retenues et orchestrer la signature numerique.',
    primaryCta: {
      label: 'Planifier une session finance',
      to: '/essai-gratuit?vertical=accounting',
    },
    secondaryCta: {
      label: 'Voir la suite facturation',
      to: '/admin/invoices',
    },
  },
  metrics: [
    { label: 'Delai emission facture', value: '-45 %' },
    { label: 'Recouvrement 30 jours', value: '+28 %' },
    { label: 'Pieces conformes', value: '100 %' },
  ],
  promise: [
    {
      title: 'Numerotation UEMOA',
      description: 'Configurez vos masques par pays, incluez retenues, TVA, acomptes et exportez vers vos ERP existants.',
    },
    {
      title: 'Portail client',
      description: 'Partagez devis et factures avec signature numerique, commentaires et suivi de validation.',
    },
    {
      title: 'Relances intelligentes',
      description: 'Combinez email, WhatsApp et rappel telephone avec scenarios pre approuves par marketing.',
    },
  ],
  useCases: [
    {
      title: 'Cabinets multi clients',
      description: 'Centralisez les dossiers clients avec droits granularises et reporting par mandat.',
      bullets: [
        'Workflow devis > bon de commande > facture',
        'Exports comptables vers Sage, QuickBooks et Odoo',
        'Journal des signatures et piste d audit integree',
      ],
    },
    {
      title: 'Declaratifs fiscaux',
      description: 'Generez les fichiers fiscaux et annexes a partir de vos factures et reglements consolides.',
      bullets: [
        'Mapping automatique des taxes par pays',
        'Suivi echeances et alertes by mail et WhatsApp',
        'Exports compatibles DGID, DGI, DGD locales',
      ],
    },
  ],
  resources: [
    { label: 'Modele lettre de mission numerique', to: '/ressources#kit' },
    { label: 'Checklist e-facturation UEMOA', to: '/ressources#compliance' },
  ],
  testimonials: [
    {
      quote:
        'Nous avons divise par deux le temps entre validation de devis et emission de facture. Les retenues et TVA sont gerees automatiquement.',
      author: 'Cabinet Axiale',
      role: 'Associe comptable Abidjan',
      metric: '-12 jours cycle cash',
    },
  ],
  preview: {
    headline: 'Fluidifiez les dossiers comptables avec numerotation legale automatisee.',
    bullets: [
      'Portail client et signature numerique',
      'Retenues a la source et TVA par pays',
      'Exports comptables et audit trail',
    ],
    ctaLabel: 'Explorer finance',
    ctaTo: '/verticals/accounting',
  },
}
