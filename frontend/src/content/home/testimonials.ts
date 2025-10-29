export type TestimonialPreview = {
  id: string
  slug: string
  company: string
  location: string
  quote: string
  person: {
    name: string
    role: string
  }
  sector: {
    label: string
    badge: string
  }
  metrics: Array<{
    label: string
    value: string
  }>
  portrait: string
  logo: string
  detailPath: string
}

export const homeTestimonials: TestimonialPreview[] = [
  {
    id: 'retail-dakar',
    slug: 'retail-dakar',
    company: 'Maison Ndar Boutique',
    location: 'Dakar, Senegal',
    quote:
      'Nous avons synchronise caisse, WhatsApp et inventaire en 21 jours. Les ventes click and collect ont triple sur Ramadan.',
    person: {
      name: 'Aissa Ndiaye',
      role: 'Directrice retail et experience boutique',
    },
    sector: {
      label: 'Retail omnicanal',
      badge: 'Retail Dakar',
    },
    metrics: [
      { label: 'Croissance panier moyen', value: '+32 %' },
      { label: 'Rotation stock', value: '-18 jours' },
      { label: 'Satisfaction clients', value: '94 %' },
    ],
    portrait: '/assets/brand/testimonial-retail-dakar.svg',
    logo: '/assets/brand/logo1.png',
    detailPath: '/temoignages/retail-dakar',
  },
  {
    id: 'agence-abidjan',
    slug: 'agence-abidjan',
    company: 'Studio Latitude',
    location: 'Abidjan, Cote d Ivoire',
    quote:
      'Reporting ROI live et briefs geolocalises ont change nos campagnes OOH. Equipes clientes valident en 48 h au lieu de 10 jours.',
    person: {
      name: 'Joel Kouadio',
      role: 'Fondateur et directeur conseil',
    },
    sector: {
      label: 'Agences marketing',
      badge: 'Agence marketing Abidjan',
    },
    metrics: [
      { label: 'Temps de validation', value: '-62 %' },
      { label: 'ROI moyen par campagne', value: '+19 %' },
      { label: 'Briefs finalises/mois', value: '18' },
    ],
    portrait: '/assets/brand/testimonial-agence-abidjan.svg',
    logo: '/assets/brand/logo2.png',
    detailPath: '/temoignages/agence-marketing-abidjan',
  },
  {
    id: 'cabinet-lome',
    slug: 'cabinet-lome',
    company: 'Cabinet Fiscogestion',
    location: 'Lome, Togo',
    quote:
      'Les workflows TVA multi pays sont preconfigures. Nous bouclons TVA trimestrielle groupee quatre fois plus vite.',
    person: {
      name: 'Leonce Amegah',
      role: 'Associe fiscaliste',
    },
    sector: {
      label: 'Comptabilite et fiscalite',
      badge: 'Cabinet comptable Lome',
    },
    metrics: [
      { label: 'Temps cloture TVA', value: '-74 %' },
      { label: 'Dossiers sans ecart', value: '100 %' },
      { label: 'Temps recouvrement', value: '-28 jours' },
    ],
    portrait: '/assets/brand/testimonial-comptable-lome.svg',
    logo: '/assets/brand/logo1.png',
    detailPath: '/temoignages/cabinet-comptable-lome',
  },
  {
    id: 'group-multi',
    slug: 'group-multi',
    company: 'Alliance Impact Group',
    location: 'Cotonou, Porto-Novo, Bamako',
    quote:
      'Avec les vues consolidees par filiale nous pilotons flux de tresorerie et inventaire depuis un seul cockpit regional.',
    person: {
      name: 'Seynabou Traore',
      role: 'Directrice transformation groupe',
    },
    sector: {
      label: 'Groupes multi filiales',
      badge: 'Groupe multi filiales',
    },
    metrics: [
      { label: 'Delai reporting', value: '-5 jours' },
      { label: 'Consolidation cash flow', value: 'J+1' },
      { label: 'Onboarding filiales', value: '72 h' },
    ],
    portrait: '/assets/brand/testimonial-groupe-filiales.svg',
    logo: '/assets/brand/logo2.png',
    detailPath: '/temoignages/groupe-multi-filiales',
  },
]

