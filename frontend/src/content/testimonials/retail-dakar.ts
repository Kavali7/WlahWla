import type { TestimonialDetail } from './types'

export const retailDakarTestimonial: TestimonialDetail = {
  slug: 'retail-dakar',
  company: 'Maison Ndar Boutique',
  location: 'Dakar, Senegal',
  sector: {
    badge: 'Retail Dakar',
    label: 'Retail omnicanal',
  },
  hero: {
    quote:
      'Nous avons synchronise caisse, WhatsApp et inventaire en 21 jours. Les ventes click and collect ont triple sur Ramadan.',
    person: {
      name: 'Aissa Ndiaye',
      role: 'Directrice retail et experience boutique',
    },
    metrics: [
      {
        label: 'Croissance panier moyen',
        value: '+32 %',
        description: 'Comparaison avril vs fevrier 2025',
      },
      {
        label: 'Rotation stock',
        value: '-18 jours',
        description: 'Cycle moyen de rotation des stocks',
      },
      {
        label: 'Satisfaction clients',
        value: '94 %',
        description: 'Score NPS post achat',
      },
    ],
    portrait: '/assets/brand/testimonial-retail-dakar.svg',
    portraitAlt: 'Portrait illustration Maison Ndar Boutique Retail Dakar',
    logo: '/assets/brand/logo1.png',
  },
  summary:
    'Maison Ndar Boutique a deploye WLAHWLA pour connecter boutique physique, WhatsApp Commerce et livraisons. L equipe retail monitor les ventes temps reel et pilote les campagnes Ramadan depuis un seul cockpit.',
  challenge:
    'Avant WLAHWLA, les stocks et canaux WhatsApp etaient pilotes sur des fichiers manuels. Les erreurs d inventaire generaiennt des ruptures critiques et un manque de visibilite pour la direction.',
  solution: [
    'Onboarding express 21 jours avec playbooks retail Dakar valides marketing et juridique.',
    'Activation inventaire omnicanal et API WhatsApp Business pour commandes click and collect.',
    'Formation vendeurs et livreurs via stories video et mini quiz conformes a la charte HR.',
  ],
  impact: [
    'Panier moyen +32 % et conversion click and collect x3 sur Ramadan documentes dans Looker Studio.',
    'Ruptures de stock critiques divisees par 4 grace aux alertes automatiques et aux reapprovisionnements partenaires.',
    'Equipe fiancee a 94 % de satisfaction clients (NPS) apres mise en route du support WhatsApp.',
  ],
  complianceNotes: [
    'Mentions legales mise en rayon validees par le cabinet juridique sponsor (Me Diop Partners) le 2025-05-12.',
    'Autorisation communication cliente WhatsApp conforme a la note ARTP 2024-17, archivee dans Confluence Marketing.',
  ],
  media: [
    {
      type: 'image',
      src: '/assets/brand/testimonial-retail-dakar.svg',
      alt: 'Portrait retail Maison Ndar Boutique',
      caption: 'Portrait officiel valide marketing pour la campagne Ramadan 2025.',
    },
  ],
  cta: {
    label: 'Decoder les workflows retail',
    to: '/verticals/retail',
  },
  meta: {
    title: 'Maison Ndar Boutique - Retail omnicanal a Dakar',
    description:
      'Comment Maison Ndar Boutique a triple ses ventes click and collect avec WLAHWLA et reduit ses ruptures critiques.',
  },
}

