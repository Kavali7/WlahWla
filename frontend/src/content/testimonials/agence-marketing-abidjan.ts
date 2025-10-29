import type { TestimonialDetail } from './types'

export const agenceMarketingAbidjanTestimonial: TestimonialDetail = {
  slug: 'agence-marketing-abidjan',
  company: 'Studio Latitude',
  location: 'Abidjan, Cote d Ivoire',
  sector: {
    badge: 'Agence marketing Abidjan',
    label: 'Agences marketing',
  },
  hero: {
    quote:
      'Reporting ROI live et briefs geolocalises ont change nos campagnes OOH. Equipes clientes valident en 48 h au lieu de 10 jours.',
    person: {
      name: 'Joel Kouadio',
      role: 'Fondateur et directeur conseil',
    },
    metrics: [
      {
        label: 'Temps validation briefs',
        value: '-62 %',
        description: 'Delai moyen passage brief > go decision',
      },
      {
        label: 'ROI moyen campagne',
        value: '+19 %',
        description: 'ROI global vs precedent trimestre',
      },
      {
        label: 'Briefs finalises par mois',
        value: '18',
        description: 'Volume moyen depuis integration WLAHWLA',
      },
    ],
    portrait: '/assets/brand/testimonial-agence-abidjan.svg',
    portraitAlt: 'Portrait illustration Studio Latitude Abidjan',
    logo: '/assets/brand/logo2.png',
  },
  summary:
    'Studio Latitude automatise la gestion de ses campagnes waohdigital et optimise les retours clients avec un reporting cross canal accessible en temps reel.',
  challenge:
    'Les campagnes OOH etaient suivies manuellement. Les clients attendaient plusieurs jours pour recevoir les proofs, rendant difficile la validation des nouveaux briefs.',
  solution: [
    'Hub campagnes connecte a waohdigital et import audience CRM valide par l equipe juridique donnees.',
    'Templates de briefs geolocalises multi quartiers Abidjan et suivi WhatsApp avec relances planifiees.',
    'Tableaux de bord KPI partages en live avec les clients grace au mode portail dedie.',
  ],
  impact: [
    'Delai moyen de validation divise par 2.6 et cycle de facturation reduit de 8 jours.',
    'Campagnes ROI moyen +19 % sur trimestre, avec analytics verifies par l equipe finance client.',
    'Capital confiance clients renforce grace a la transparence du portail et aux relances automatiques capturees.',
  ],
  complianceNotes: [
    'Charte visuelle OOH et mentions legales valides par marketing WLAHWLA (note 2025-04-21).',
    'Accords de partage audiences CRM confirmes par le legal local (CAB Abidjan) et archive 2025-05-03.',
  ],
  media: [
    {
      type: 'image',
      src: '/assets/brand/testimonial-agence-abidjan.svg',
      alt: 'Portrait Studio Latitude et visuel campagne',
      caption: 'Placeholder portrait et pattern OOH en attendant les shoots terrain.',
    },
  ],
  cta: {
    label: 'Explorer les campagnes waohdigital',
    to: '/verticals/agencies',
  },
  meta: {
    title: 'Studio Latitude - Campagnes marketing Abidjan',
    description:
      'Comment Studio Latitude accelere la validation de ses campagnes waohdigital et augmente son ROI marketing.',
  },
}

