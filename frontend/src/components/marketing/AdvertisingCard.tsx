import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'

export type AdvertisingCardProps = {
  badge: string
  title: string
  description: string
  image: string
  imageAlt: string
  stats?: Array<{
    label: string
    value: string
  }>
  cta?: {
    label: string
    href: string
  }
  className?: string
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export const AdvertisingCard: React.FC<AdvertisingCardProps> = ({
  badge,
  title,
  description,
  image,
  imageAlt,
  stats,
  cta,
  className,
}) => (
  <article
    className={cx(
      'relative grid gap-6 overflow-hidden rounded-3xl border border-surface-outline bg-surface shadow-elevated md:grid-cols-[1.1fr_0.9fr]',
      className,
    )}
  >
    <div className="flex flex-col gap-4 p-6 md:p-8">
      <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-surface-outlineStrong bg-surface-subtle px-4 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
        {badge}
      </span>
      <h4 className="text-2xl font-semibold text-secondary-900">{title}</h4>
      <p className="text-sm text-neutral-600">{description}</p>
      {stats && (
        <dl className="grid gap-3 sm:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-surface-outline bg-surface-subtle px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-secondary-600">{stat.label}</dt>
              <dd className="text-lg font-semibold text-secondary-800">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {cta && (
        <Button as={Link} to={cta.href} size="sm" variant="outline" className="w-fit">
          {cta.label}
        </Button>
      )}
    </div>
    <figure className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-card-glow opacity-50" aria-hidden />
      <img
        src={image}
        alt={imageAlt}
        className="relative h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </article>
)

AdvertisingCard.displayName = 'AdvertisingCard'
