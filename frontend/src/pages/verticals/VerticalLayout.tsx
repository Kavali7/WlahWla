import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import type { VerticalContent } from '../../content/verticals/types'

type VerticalLayoutProps = {
  vertical: VerticalContent
}

export const VerticalLayout: React.FC<VerticalLayoutProps> = ({ vertical }) => {
  return (
    <div className="space-y-16 pb-20">
      <section className="rounded-3xl border border-surface-outline bg-white px-8 py-12 shadow-elevated md:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-pill border border-primary/20 bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              {vertical.eyebrow}
            </span>
            <h1 className="text-3xl font-semibold text-secondary-800 md:text-4xl">{vertical.hero.heading}</h1>
            <p className="text-sm text-neutral-600 md:text-base">{vertical.hero.description}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as={Link} to={vertical.hero.primaryCta.to} size="md">
                {vertical.hero.primaryCta.label}
              </Button>
              <Button as={Link} to={vertical.hero.secondaryCta.to} variant="secondary" size="md">
                {vertical.hero.secondaryCta.label}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {vertical.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-primary/10 bg-primary-50/70 px-5 py-4 text-primary-700 shadow-service"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <header className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-secondary-800 md:text-3xl">Pourquoi cette verticale</h2>
          <p className="text-sm text-neutral-600 md:text-base">{vertical.summary}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {vertical.promise.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-surface-outline bg-surface-subtle/90 p-6 shadow-service"
            >
              <h3 className="text-lg font-semibold text-secondary-800">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-secondary-800 md:text-3xl">Parcours types</h2>
          <p className="text-sm text-neutral-600 md:text-base">
            Inspirez-vous des workflows valides par l equipe marketing et produit pour lancer rapidement.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {vertical.useCases.map((useCase) => (
            <article key={useCase.title} className="rounded-3xl border border-surface-outline bg-white p-6 shadow-service">
              <h3 className="text-lg font-semibold text-secondary-800">{useCase.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{useCase.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {useCase.bullets.map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-surface-outline bg-white px-8 py-10 shadow-floating md:px-12">
        <h2 className="text-2xl font-semibold text-secondary-800 md:text-3xl">Ce que disent vos pairs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {vertical.testimonials.map((testimonial) => (
            <blockquote key={testimonial.quote} className="space-y-3 rounded-2xl border border-surface-outline bg-surface-subtle p-6">
              <p className="text-sm text-neutral-600">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="text-sm font-semibold text-secondary-700">
                {testimonial.author} &middot; {testimonial.role}
                {testimonial.metric ? (
                  <span className="ml-2 rounded-full bg-success-50 px-2 py-1 text-xs font-semibold text-success-600">
                    {testimonial.metric}
                  </span>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-dashed border-surface-outline bg-surface-subtle px-8 py-10 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">Ressources utiles</p>
            <h2 className="mt-2 text-xl font-semibold text-secondary-800">Allez plus loin avec votre equipe</h2>
          </div>
          <Button as={Link} to={vertical.hero.primaryCta.to} size="md">
            {vertical.hero.primaryCta.label}
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {vertical.resources.map((resource) => (
            <Link
              key={resource.label}
              to={resource.to}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary-600 hover:border-primary/40 hover:text-primary-500"
            >
              {resource.label} -&gt;
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
