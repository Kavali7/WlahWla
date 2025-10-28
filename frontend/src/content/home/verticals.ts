import { allVerticals } from '../verticals'
import type { VerticalSlug } from '../verticals/types'

export type VerticalPreview = {
  id: VerticalSlug
  icon: VerticalSlug
  title: string
  summary: string
  bullets: string[]
  cta: {
    label: string
    to: string
  }
}

export const verticalPreviews: VerticalPreview[] = allVerticals.map((vertical) => ({
  id: vertical.slug,
  icon: vertical.icon,
  title: vertical.title,
  summary: vertical.preview.headline,
  bullets: vertical.preview.bullets,
  cta: {
    label: vertical.preview.ctaLabel,
    to: vertical.preview.ctaTo,
  },
}))
