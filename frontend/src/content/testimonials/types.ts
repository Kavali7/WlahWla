export type TestimonialMetric = {
  label: string
  value: string
  description: string
}

export type TestimonialMedia = {
  type: 'image' | 'video'
  src: string
  alt: string
  caption?: string
}

export type TestimonialDetail = {
  slug: string
  company: string
  location: string
  sector: {
    badge: string
    label: string
  }
  hero: {
    quote: string
    person: {
      name: string
      role: string
    }
    metrics: TestimonialMetric[]
    portrait: string
    portraitAlt: string
    logo: string
  }
  summary: string
  challenge: string
  solution: string[]
  impact: string[]
  complianceNotes: string[]
  media: TestimonialMedia[]
  cta: {
    label: string
    to: string
  }
  meta: {
    title: string
    description: string
  }
}

