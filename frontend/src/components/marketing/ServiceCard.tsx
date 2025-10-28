import React from 'react'
import { Link } from 'react-router-dom'
import type { ServiceId, ServiceOffering } from '@/content/home/services'

const iconMap: Record<ServiceId, JSX.Element> = {
  commerce: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M8.8 12h14.4l-1.1 13.2a2 2 0 0 1-2 1.8H11.9a2 2 0 0 1-2-1.8L8.8 12zm4.2 5.6h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 11.6V10a3.5 3.5 0 0 1 3.5-3.5h0a3.5 3.5 0 0 1 3.5 3.5v1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12h20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  ),
  billing: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M10.5 6h11a2 2 0 0 1 2 2v16l-4-2.8-4 2.8-4-2.8-4 2.8V8a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12.8 12h7.2M12.8 16h4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10.5 6h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  ),
  campaigns: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M7 16a9 9 0 0 1 9-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <path
        d="M24.5 8.5 17 16l7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 23a7 7 0 0 1-7-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <path
        d="M8 20.5c0 3.6 3.6 6.5 8 6.5s8-2.9 8-6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 15a8 8 0 1 0-16 0v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h0m16 5a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M14 26h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  ),
}

const combine = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ')

export type ServiceCardProps = ServiceOffering & {
  className?: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, summary, bullets, cta, className }) => (
  <article
    className={combine(
      'group relative flex h-full flex-col gap-5 rounded-3xl border border-surface-outline bg-white p-8 shadow-service transition-transform duration-300',
      'hover:-translate-y-2 hover:shadow-elevated motion-reduce:transform-none motion-reduce:shadow-service',
      className,
    )}
  >
    <span className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-[#5864FF]/0 via-[#5864FF]/20 to-[#5864FF]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div
      className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#5864FF]/30 bg-[#5864FF]/10 text-[#5864FF] shadow-[0_10px_24px_-12px_rgba(88,100,255,0.35)]"
      aria-hidden="true"
    >
      {iconMap[icon]}
    </div>
    <header className="space-y-2">
      <h3 className="text-xl font-semibold text-secondary-800">{title}</h3>
      <p className="text-sm text-neutral-600">{summary}</p>
    </header>
    <ul className="mt-1 space-y-3 text-sm text-secondary-700">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#5864FF]" aria-hidden="true" />
          <span className="flex-1 text-neutral-600">{bullet}</span>
        </li>
      ))}
    </ul>
    <div className="pt-4">
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
