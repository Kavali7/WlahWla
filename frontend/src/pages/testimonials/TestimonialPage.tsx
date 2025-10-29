import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { testimonialsBySlug } from '../../content/testimonials'
import type { TestimonialSlug } from '../../content/testimonials'

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const TestimonialPage: React.FC = () => {
  const { slug } = useParams<{ slug: TestimonialSlug }>()

  if (!slug || !testimonialsBySlug[slug]) {
    return <Navigate to="/home#temoignages" replace />
  }

  const testimonial = testimonialsBySlug[slug]

  return (
    <div className="space-y-16 pb-20">
      <section className="rounded-3xl border border-surface-outline bg-white px-6 py-10 shadow-elevated md:px-12">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                {testimonial.sector.badge}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{testimonial.location}</span>
            </div>
            <h1 className="text-4xl font-semibold text-secondary-900 md:text-5xl">&ldquo;{testimonial.hero.quote}&rdquo;</h1>
            <p className="text-sm text-neutral-600">
              {testimonial.hero.person.name} &mdash; {testimonial.hero.person.role}, {testimonial.company}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonial.hero.metrics.map((metric) => (
                <div
                  key={`${testimonial.slug}-${metric.label}`}
                  className="rounded-2xl border border-surface-outline bg-white px-5 py-4 shadow-elevated"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600/80">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-secondary-900">{metric.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{metric.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to={testimonial.cta.to} size="md">
                {testimonial.cta.label}
              </Button>
              <Button as={Link} to="/home#temoignages" variant="secondary" size="md">
                Retour aux temoignages
              </Button>
            </div>
          </div>
          <aside className="flex flex-col items-center gap-4 rounded-3xl border border-surface-outline bg-neutral-50 p-6 text-center shadow-floating">
            <img
              src={testimonial.hero.portrait}
              alt={testimonial.hero.portraitAlt}
              className="h-32 w-32 rounded-3xl border border-surface-outline object-cover shadow-elevated"
              loading="eager"
              decoding="async"
            />
            <img
              src={testimonial.hero.logo}
              alt={`${testimonial.company} logo`}
              className="h-12 w-32 object-contain"
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm text-neutral-600">{testimonial.summary}</p>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-surface-outline bg-white px-6 py-6 shadow-elevated">
          <h2 className="text-xl font-semibold text-secondary-800">Contexte et enjeu</h2>
          <p className="mt-4 text-sm text-neutral-600">{testimonial.challenge}</p>
        </article>
        <article className="rounded-3xl border border-surface-outline bg-white px-6 py-6 shadow-elevated">
          <h2 className="text-xl font-semibold text-secondary-800">Impact mesure</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            {testimonial.impact.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article className="rounded-3xl border border-surface-outline bg-white px-6 py-6 shadow-elevated">
          <h2 className="text-xl font-semibold text-secondary-800">Solution deployee</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            {testimonial.solution.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary-700" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </article>
        <aside className="rounded-3xl border border-surface-outline bg-white px-6 py-6 shadow-elevated">
          <h2 className="text-xl font-semibold text-secondary-800">Gouvernance et conformite</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            {testimonial.complianceNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="space-y-4">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600/80">Assets media</p>
            <h2 className="text-2xl font-semibold text-secondary-800 md:text-3xl">Galerie et references</h2>
          </div>
          <Link
            to="/home#temoignages"
            className="text-sm font-semibold text-primary-600 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Retour landing {'->'}
          </Link>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonial.media.map((item) => (
            <figure
              key={item.src}
              className={cx(
                'flex flex-col gap-3 rounded-3xl border border-surface-outline bg-white p-5 shadow-floating',
                item.type === 'video' && 'bg-secondary-900/80 text-white',
              )}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-48 w-full rounded-2xl border border-surface-outline object-cover"
                loading="lazy"
                decoding="async"
              />
              {item.caption && <figcaption className="text-xs text-neutral-500">{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TestimonialPage
