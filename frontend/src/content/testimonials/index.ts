import { agenceMarketingAbidjanTestimonial } from './agence-marketing-abidjan'
import { cabinetComptableLomeTestimonial } from './cabinet-comptable-lome'
import { groupeMultiFilialesTestimonial } from './groupe-multi-filiales'
import { retailDakarTestimonial } from './retail-dakar'
import type { TestimonialDetail } from './types'

const testimonialList: TestimonialDetail[] = [
  retailDakarTestimonial,
  agenceMarketingAbidjanTestimonial,
  cabinetComptableLomeTestimonial,
  groupeMultiFilialesTestimonial,
]

export type TestimonialSlug = (typeof testimonialList)[number]['slug']

export const testimonialsBySlug: Record<TestimonialSlug, TestimonialDetail> = testimonialList.reduce(
  (acc, testimonial) => {
    acc[testimonial.slug] = testimonial
    return acc
  },
  {} as Record<TestimonialSlug, TestimonialDetail>,
)

export const testimonials = testimonialList

