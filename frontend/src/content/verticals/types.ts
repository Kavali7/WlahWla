export type VerticalSlug = 'retail' | 'accounting' | 'services' | 'agencies'

export type VerticalResource = {
  label: string
  to: string
}

export type VerticalMetric = {
  label: string
  value: string
}

export type VerticalUseCase = {
  title: string
  description: string
  bullets: string[]
}

export type VerticalTestimonial = {
  quote: string
  author: string
  role: string
  metric?: string
}

export type VerticalContent = {
  slug: VerticalSlug
  icon: VerticalSlug
  title: string
  eyebrow: string
  summary: string
  hero: {
    heading: string
    description: string
    primaryCta: {
      label: string
      to: string
    }
    secondaryCta: {
      label: string
      to: string
    }
  }
  metrics: VerticalMetric[]
  promise: {
    title: string
    description: string
  }[]
  useCases: VerticalUseCase[]
  resources: VerticalResource[]
  testimonials: VerticalTestimonial[]
  preview: {
    headline: string
    bullets: string[]
    ctaLabel: string
    ctaTo: string
  }
}
