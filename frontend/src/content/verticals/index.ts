import { accountingVertical } from './accounting'
import { agenciesVertical } from './agencies'
import { retailVertical } from './retail'
import { servicesVertical } from './services'
import type { VerticalContent, VerticalSlug } from './types'

const verticalList: VerticalContent[] = [retailVertical, accountingVertical, servicesVertical, agenciesVertical]

export const verticalsBySlug: Record<VerticalSlug, VerticalContent> = verticalList.reduce(
  (acc, vertical) => {
    acc[vertical.slug] = vertical
    return acc
  },
  {} as Record<VerticalSlug, VerticalContent>,
)

export const allVerticals = verticalList
