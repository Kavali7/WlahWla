import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'

export type HeroCarouselSlide = {
  id: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  cta?: {
    label: string
    href: string
  }
  metrics?: Array<{
    label: string
    value: string
  }>
}

export type HeroCarouselProps = {
  slides: HeroCarouselSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  className,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const touchStartX = React.useRef<number | null>(null)
  const slideCount = slides.length

  React.useEffect(() => {
    if (!autoPlay || slideCount <= 1 || isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount)
    }, autoPlayInterval)
    return () => window.clearInterval(timer)
  }, [autoPlay, autoPlayInterval, isPaused, slideCount])

  const goTo = React.useCallback(
    (index: number) => {
      if (index < 0) {
        setActiveIndex(slideCount - 1)
      } else if (index >= slideCount) {
        setActiveIndex(0)
      } else {
        setActiveIndex(index)
      }
    },
    [slideCount],
  )

  const activeSlide = slides[activeIndex]

  return (
    <section
      className={cx(
        'relative overflow-hidden rounded-hero bg-secondary-900 text-surface-cardForeground shadow-floating',
        className,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const delta = event.changedTouches[0]?.clientX ?? touchStartX.current
        const diff = delta - touchStartX.current
        if (Math.abs(diff) > 50) {
          goTo(diff > 0 ? activeIndex - 1 : activeIndex + 1)
        }
        touchStartX.current = null
      }}
    >
      <div className="absolute inset-0 wl-hero-gradient opacity-90" aria-hidden />
      <div
        className="relative flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <article
            key={slide.id}
            className="grid min-w-full gap-8 px-6 py-12 md:grid-cols-2 md:px-12 lg:px-16"
            aria-hidden={activeSlide.id !== slide.id}
          >
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-surface-badge-strong bg-surface-badge px-4 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
                {slide.label}
              </span>
              <h1 className="text-4xl font-semibold text-white md:text-5xl">{slide.title}</h1>
              <p className="max-w-xl text-lg text-white/85">{slide.description}</p>
              {slide.metrics && slide.metrics.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {slide.metrics.map((metric) => (
                    <div
                      key={`${slide.id}-${metric.label}`}
                      className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur-sm"
                    >
                      <div className="text-xs uppercase tracking-wide text-white/70">{metric.label}</div>
                      <div className="text-lg font-semibold">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}
              {slide.cta && (
                <Button as={Link} to={slide.cta.href} size="lg" className="w-fit">
                  {slide.cta.label}
                </Button>
              )}
            </div>
            <figure className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-card-glow opacity-60 blur-3xl" />
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="relative h-auto w-full max-w-xl rounded-3xl border border-white/10 object-cover shadow-elevated"
                loading={activeSlide.id === slide.id ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          </article>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-6 md:px-12">
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-badge backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Diapositive precedente"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-badge backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Diapositive suivante"
          >
            ›
          </button>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cx(
                'h-2.5 w-7 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                index === activeIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50',
              )}
              aria-label={`Afficher ${slide.label}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

HeroCarousel.displayName = 'HeroCarousel'
