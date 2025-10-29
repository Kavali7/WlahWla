import React from 'react'
import { Link } from 'react-router-dom'
import type { TestimonialPreview } from '@/content/home/testimonials'

type TestimonialCarouselProps = {
  testimonials: TestimonialPreview[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 7000,
  className,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const reduceMotion = React.useRef(false)
  const containerRef = React.useRef<HTMLElement | null>(null)
  const slideWrapperRef = React.useRef<HTMLDivElement | null>(null)
  const autoPlayTimer = React.useRef<number | null>(null)

  const totalSlides = testimonials.length

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  React.useEffect(() => {
    const shouldRun = autoPlay && totalSlides > 1 && !isPaused && !reduceMotion.current
    if (!shouldRun) {
      if (autoPlayTimer.current) {
        window.clearInterval(autoPlayTimer.current)
        autoPlayTimer.current = null
      }
      return
    }

    autoPlayTimer.current = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % totalSlides)
    }, autoPlayInterval)

    return () => {
      if (autoPlayTimer.current) {
        window.clearInterval(autoPlayTimer.current)
        autoPlayTimer.current = null
      }
    }
  }, [autoPlay, autoPlayInterval, isPaused, totalSlides])

  const moveTo = React.useCallback(
    (nextIndex: number) => {
      setActiveIndex((index) => {
        if (nextIndex < 0) return totalSlides - 1
        if (nextIndex >= totalSlides) return 0
        return nextIndex
      })
    },
    [totalSlides],
  )

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev)
  }

  const handleManualNavigation = (index: number) => {
    setIsPaused(true)
    moveTo(index)
  }

  const handleControlFocus = React.useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          setIsPaused(true)
          moveTo(activeIndex - 1)
          break
        case 'ArrowRight':
          event.preventDefault()
          setIsPaused(true)
          moveTo(activeIndex + 1)
          break
        case 'Home':
          event.preventDefault()
          handleManualNavigation(0)
          break
        case 'End':
          event.preventDefault()
          handleManualNavigation(totalSlides - 1)
          break
        default:
          break
      }
    },
    [activeIndex, handleManualNavigation, handlePauseToggle, moveTo, totalSlides],
  )

  React.useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const listener = (event: KeyboardEvent) => handleKeyDown(event)
    node.addEventListener('keydown', listener)
    return () => {
      node.removeEventListener('keydown', listener)
    }
  }, [handleKeyDown])

  return (
    <section
      ref={containerRef}
      className={cx(
        'relative overflow-hidden rounded-3xl border border-surface-outline bg-white shadow-elevated',
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Temoignages clients UEMOA"
    >
      <div className="flex items-center justify-between border-b border-surface-outline/60 px-6 py-4 md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600/80">Voix clients</p>
          <h3 className="text-lg font-semibold text-secondary-800 md:text-xl">Temoignages valides marketing</h3>
        </div>
        <button
          type="button"
          onClick={handlePauseToggle}
          className={cx(
            'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition',
            isPaused ? 'border-primary-100 bg-primary-50 text-primary-700' : 'border-surface-outline text-secondary-700',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
          )}
          aria-pressed={isPaused}
          aria-label={isPaused ? 'Relancer l auto play des temoignages' : 'Mettre en pause l auto play des temoignages'}
        >
          {isPaused ? 'Lecture' : 'Pause'}
        </button>
      </div>

      <div ref={slideWrapperRef} className="relative" aria-live={isPaused ? 'polite' : 'off'}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => {
            const isActive = index === activeIndex
            return (
              <article
                key={testimonial.id}
                className="min-w-full px-6 py-8 md:px-10 md:py-12"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} sur ${totalSlides}`}
                aria-hidden={!isActive}
                tabIndex={-1}
              >
                <div
                  className={cx(
                    'flex flex-col gap-6 rounded-3xl border border-surface-outline bg-white/90 px-6 py-6 shadow-floating md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center md:gap-10',
                    'transition-all duration-500 ease-out motion-reduce:duration-0 motion-reduce:opacity-100 motion-reduce:translate-y-0',
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                  )}
                >
                  <header className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                        {testimonial.sector.badge}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        {testimonial.person.role}
                      </span>
                    </div>
                    <h4 className="text-2xl font-semibold text-secondary-900 md:text-3xl">&ldquo;{testimonial.quote}&rdquo;</h4>
                    <p className="text-sm text-neutral-600">
                      {testimonial.person.name} &mdash; {testimonial.company}, {testimonial.location}
                    </p>
                  </header>

                  <div className="flex flex-col gap-6">
                    <dl className="grid gap-3 sm:grid-cols-3">
                      {testimonial.metrics.map((metric) => (
                        <div
                          key={`${testimonial.id}-${metric.label}`}
                          className="rounded-2xl border border-surface-outline/70 bg-white px-4 py-3 text-left shadow-elevated"
                        >
                          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600/80">
                            {metric.label}
                          </dt>
                          <dd className="text-xl font-semibold text-secondary-900">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.portrait}
                        alt={`Portrait ${testimonial.person.name}`}
                        className="h-16 w-16 rounded-2xl border border-surface-outline object-cover shadow-elevated"
                        loading={isActive ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-secondary-800">{testimonial.company}</p>
                        <p className="text-neutral-500">{testimonial.sector.label}</p>
                        <Link
                          to={testimonial.detailPath}
                          tabIndex={isActive ? 0 : -1}
                          className="mt-1 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                        >
                          Lire le cas complet {'->'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-outline/60 bg-gradient-to-r from-white via-white/95 to-white/90 px-6 py-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span aria-live="polite">
              Slide {activeIndex + 1} sur {totalSlides}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleManualNavigation(activeIndex - 1)}
              onFocus={handleControlFocus}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-outline/80 bg-white text-secondary-700 shadow-badge transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Diapositive precedente"
            >
              {'<'}
            </button>
            <button
              type="button"
              onClick={() => handleManualNavigation(activeIndex + 1)}
              onFocus={handleControlFocus}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-outline/80 bg-white text-secondary-700 shadow-badge transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Diapositive suivante"
            >
              {'>'}
            </button>
            <ul className="flex items-center gap-2">
              {testimonials.map((testimonial, index) => (
                <li key={testimonial.id}>
                  <button
                    type="button"
                    onClick={() => handleManualNavigation(index)}
                    onFocus={handleControlFocus}
                    className={cx(
                      'h-2.5 w-7 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                      index === activeIndex ? 'bg-primary-500' : 'bg-neutral-300 hover:bg-neutral-400',
                    )}
                    aria-label={`Afficher le temoignage ${testimonial.company}`}
                    aria-current={index === activeIndex}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

TestimonialCarousel.displayName = 'TestimonialCarousel'
