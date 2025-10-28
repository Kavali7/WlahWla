import React from 'react'
import { Link } from 'react-router-dom'
import type { VerticalPreview } from '@/content/home/verticals'
import type { VerticalSlug } from '@/content/verticals/types'

const iconMap: Record<VerticalSlug, JSX.Element> = {
  retail: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M7 12h18l-1.8 13.4a2 2 0 0 1-2 1.7H10.8a2 2 0 0 1-2-1.7L7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 9V8a6 6 0 0 1 12 0v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 12h22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  accounting: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M9 6h14a2 2 0 0 1 2 2v18l-4-3-5 3-5-3-4 3V8a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 12h8M12 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M9 11h14l2 4v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 21h8M12 17h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d="M11 11V9a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  agencies: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M6 14 16 7l10 7v11a2 2 0 0 1-2 2h-6v-8h-4v8h-6a2 2 0 0 1-2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M5 14h22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
}

const combine = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(' ')

export type VerticalCardProps = VerticalPreview & {
  className?: string
}

export const VerticalCard: React.FC<VerticalCardProps> = ({ icon, title, summary, bullets, cta, className }) => (
  <article
    className={combine(
      'group flex h-full flex-col gap-5 rounded-3xl border border-surface-outline bg-surface-subtle/70 p-8 shadow-service transition-all duration-300',
      'hover:-translate-y-2 hover:border-primary/40 hover:shadow-elevated motion-reduce:transform-none motion-reduce:shadow-service',
      className,
    )}
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-white text-primary-600 shadow-[0_12px_28px_-18px_rgba(88,100,255,0.55)]">
          {iconMap[icon]}
        </span>
        <h3 className="text-lg font-semibold text-secondary-800">{title}</h3>
      </div>
    </div>
    <p className="text-sm text-neutral-600">{summary}</p>
    <ul className="space-y-3 text-sm text-secondary-700">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
          <span className="flex-1 text-neutral-600">{bullet}</span>
        </li>
      ))}
    </ul>
    <div className="pt-2">
      <Link
        to={cta.to}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
      >
        {cta.label}
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  </article>
)
