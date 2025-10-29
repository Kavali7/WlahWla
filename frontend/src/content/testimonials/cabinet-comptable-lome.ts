import type { TestimonialDetail } from './types'

export const cabinetComptableLomeTestimonial: TestimonialDetail = {
  slug: 'cabinet-comptable-lome',
  company: 'Cabinet Fiscogestion',
  location: 'Lome, Togo',
  sector: {
    badge: 'Cabinet comptable Lome',
    label: 'Comptabilite et fiscalite',
  },
  hero: {
    quote:
      'Les workflows TVA multi pays sont preconfigures. Nous bouclons TVA trimestrielle groupee quatre fois plus vite.',
    person: {
      name: 'Leonce Amegah',
      role: 'Associe fiscaliste',
    },
    metrics: [
      {
        label: 'Temps cloture TVA',
        value: '-74 %',
        description: 'Cycle de cloture du groupe par trimestre',
      },
      {
        label: 'Dossiers sans ecart',
        value: '100 %',
        description: 'Conformite dossiers TVA audites 2025-Q2',
      },
      {
        label: 'Temps recouvrement',
        value: '-28 jours',
        description: 'Delai moyen de recouvrement sur retours TVA',
      },
    ],
    portrait: '/assets/brand/testimonial-comptable-lome.svg',
    portraitAlt: 'Portrait illustration Cabinet Fiscogestion Lome',
    logo: '/assets/brand/logo1.png',
  },
  summary:
    'Cabinet Fiscogestion a choisi WLAHWLA pour regrouper ses dossiers TVA sur plusieurs pays UEMOA, digitaliser les relances clients et fiabiliser la documentation fiscale.',
  challenge:
    'Les obligations TVA mensuelles et trimestrielles etaient gerees via des spreadsheets multiples. Les collaborateurs perdaient du temps a collecter les justificatifs et a relancer les clients.',
  solution: [
    'Modele TVA multi pays configure avec gabarits UEMOA valides par les juristes WLAHWLA.',
    'Workflow signature numerique et collecte pieces justificatives via portail client securise.',
    'Automatisation des relances encaissement et integration banques partenaires pour suivi recouvrement.',
  ],
  impact: [
    'Temps de cloture TVA reduit de 74 %, soulignant la productivite des equipes fiscales.',
    'Zero ecart constate lors de l audit interne 2025-Q2 grace aux controles automatiques.',
    'Delai moyen de recouvrement raccourci de 28 jours avec suivi centralise banque et mobile money.',
  ],
  complianceNotes: [
    'Modeles TVA et lettres de mission valides par WLAHWLA Legal le 2025-04-02 (ref LEG-2025-044).',
    'Archivage numerique conforme a la reglementation togolaise (circular 2024-15), validation cabinet Hounkpe 2025-05-09.',
  ],
  media: [
    {
      type: 'image',
      src: '/assets/brand/testimonial-comptable-lome.svg',
      alt: 'Portrait Cabinet Fiscogestion',
      caption: 'Illustration placeholder Fiscogestion en attendant les photos studio.',
    },
  ],
  cta: {
    label: 'Consulter la verticale comptable',
    to: '/verticals/accounting',
  },
  meta: {
    title: 'Cabinet Fiscogestion - TVA multi pays a Lome',
    description:
      'Comment Fiscogestion cloture la TVA multi pays quatre fois plus vite avec WLAHWLA et zero ecart d audit.',
  },
}

