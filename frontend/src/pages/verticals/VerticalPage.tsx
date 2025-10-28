import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { VerticalLayout } from './VerticalLayout'
import { verticalsBySlug } from '../../content/verticals'
import type { VerticalSlug } from '../../content/verticals/types'

const VerticalPage: React.FC = () => {
  const { slug } = useParams<{ slug: VerticalSlug }>()

  if (!slug || !verticalsBySlug[slug]) {
    return <Navigate to="/home#verticales" replace />
  }

  const vertical = verticalsBySlug[slug]

  return <VerticalLayout vertical={vertical} />
}

export default VerticalPage
