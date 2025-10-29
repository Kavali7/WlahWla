import type { TestimonialDetail } from './types'

export const groupeMultiFilialesTestimonial: TestimonialDetail = {
  slug: 'groupe-multi-filiales',
  company: 'Alliance Impact Group',
  location: 'Cotonou, Porto-Novo, Bamako',
  sector: {
    badge: 'Groupe multi filiales',
    label: 'Groupes multi filiales',
  },
  hero: {
    quote:
      'Avec les vues consolidees par filiale nous pilotons flux de tresorerie et inventaire depuis un seul cockpit regional.',
    person: {
      name: 'Seynabou Traore',
      role: 'Directrice transformation groupe',
    },
    metrics: [
      {
        label: 'Delai reporting',
        value: '-5 jours',
        description: 'Temps de consolidation mensuelle',
      },
      {
        label: 'Consolidation cash flow',
        value: 'J+1',
        description: 'Mise a jour cash pooling interfiliales',
      },
      {
        label: 'Onboarding filiales',
        value: '72 h',
        description: 'Delai activation complete d une nouvelle filiale',
      },
    ],
    portrait: '/assets/brand/testimonial-groupe-filiales.svg',
    portraitAlt: 'Portrait illustration Alliance Impact Group',
    logo: '/assets/brand/logo2.png',
  },
  summary:
    'Alliance Impact Group industrialise le suivi de ses filiales UEMOA. Les directions finance et operations partagent un tableau de bord groupe et executent les workflows de validation depuis WLAHWLA.',
  challenge:
    'Le groupe devait consolider des donnees finance et inventaire disperses. Les reports vers le comite de direction prenaient plus d une semaine chaque mois et les filiales etaient onboardees manuellement.',
  solution: [
    'Hub multi comptes WLAHWLA configure avec roles groupe et juridictions locales valides par le legal.',
    'Connecteurs banques et chiffre d affaires pour consolider la tresorerie et les ventes en J+1.',
    'Playbooks onboarding filiales avec formation video scroll 6 minutes et quiz de validation.',
  ],
  impact: [
    'Delai de consolidation mensuelle reduit de cinq jours grace aux donnees temps reel.',
    'Flux de tresorerie groupe visibilite J+1 permettant d anticiper les arbitrages financiers.',
    'Onboarding d une nouvelle filiale en 72 heures, incluant parametrage fiscal et training equipe locale.',
  ],
  complianceNotes: [
    'Process multi filiales valide par legal Senegal et Benin (memorandum LEG-2025-071).',
    'Audit accessibilite interne (NVDA + VoiceOver) en date du 2025-06-14 confirme la conformite du cockpit groupe.',
  ],
  media: [
    {
      type: 'image',
      src: '/assets/brand/testimonial-groupe-filiales.svg',
      alt: 'Illustration Alliance Impact Group',
      caption: 'Placeholder visuel multi filiales avant tournage sur site.',
    },
  ],
  cta: {
    label: 'Voir les capacites multi filiales',
    to: '/verticals/services',
  },
  meta: {
    title: 'Alliance Impact Group - Pilotage multi filiales',
    description:
      'Alliance Impact Group unifie ses filiales UEMOA dans WLAHWLA pour accelerer le reporting et la tresorerie.',
  },
}

