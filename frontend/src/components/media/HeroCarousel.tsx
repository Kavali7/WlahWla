import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'

type CarouselCta = {
  label: string
  href: string
  external?: boolean
}

export type HeroCarouselSlide = {
  id: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  primaryCta?: CarouselCta
  secondaryCta?: CarouselCta
  tertiaryCta?: CarouselCta
  metrics?: Array<{
    label: string
    value: string
  }>
  trustBadges?: string[]
}

export type HeroCarouselProps = {
  slides: HeroCarouselSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const isExternalLink = (href: string) => /^https?:\/\//.test(href)

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  className,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [hasRevealed, setHasRevealed] = React.useState(false)
  const touchStartX = React.useRef<number | null>(null)
  const slideCount = slides.length
  const containerRef = React.useRef<HTMLElement | null>(null)
  const reduceMotion = React.useRef(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  React.useEffect(() => {
    if (!autoPlay || slideCount <= 1 || isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount)
    }, autoPlayInterval)
    return () => window.clearInterval(timer)
  }, [autoPlay, autoPlayInterval, isPaused, slideCount])

  React.useEffect(() => {
    if (reduceMotion.current) {
      setHasRevealed(true)
      return
    }
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasRevealed(true)
            break
          }
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

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

  const handlePointerStart = (clientX: number | null) => {
    touchStartX.current = clientX
  }

  const handlePointerEnd = (clientX: number | null) => {
    if (touchStartX.current === null || clientX === null) return
    const diff = clientX - touchStartX.current
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? activeIndex - 1 : activeIndex + 1)
    }
    touchStartX.current = null
  }

  const activeSlide = slides[activeIndex]

  const renderCta = (cta: CarouselCta | undefined, variant: 'primary' | 'secondary' | 'outline') => {
    if (!cta) return null
    const external = cta.external ?? isExternalLink(cta.href)
    const sharedClassName = cx(
      'w-fit',
      variant === 'primary' && '!bg-white !text-secondary-900 hover:!bg-white/90',
      variant === 'secondary' && '!border-white/45 !text-white hover:!border-white/70 hover:!bg-white/10',
      variant === 'outline' && '!border-white/35 !text-white hover:!border-white/55 hover:!bg-white/10',
    )

    if (external) {
      return (
        <Button
          key={`${cta.label}-${cta.href}`}
          as="a"
          href={cta.href}
          target="_blank"
          rel="noreferrer"
          variant={variant}
          size="lg"
          className={sharedClassName}
        >
          {cta.label}
        </Button>
      )
    }

    return (
      <Button
        key={`${cta.label}-${cta.href}`}
        as={Link}
        to={cta.href}
        variant={variant}
        size="lg"
        className={sharedClassName}
      >
        {cta.label}
      </Button>
    )
  }

  return (
    <section
      ref={containerRef}
      className={cx(
        'relative overflow-hidden rounded-hero bg-secondary-900 text-white shadow-floating',
        className,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={(event) => handlePointerStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => handlePointerEnd(event.changedTouches[0]?.clientX ?? null)}
    >
      <div className="absolute inset-0 wl-hero-gradient" aria-hidden />
      <div className="absolute inset-0 bg-secondary-900/35" aria-hidden />

      <div
        className="relative flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => {
          const isActive = activeSlide.id === slide.id
          const reveal = hasRevealed && isActive

          return (
            <article
              key={slide.id}
              className="grid min-w-full gap-10 px-6 py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:px-12 lg:px-16"
              aria-hidden={!isActive}
            >
              <div
                className={cx(
                  'flex flex-col gap-6 transition-all duration-700 ease-out motion-reduce:duration-0 motion-reduce:transform-none motion-reduce:opacity-100',
                  reveal ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
                )}
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-white/35 bg-white/12 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  {slide.label}
                </span>
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">{slide.title}</h1>
                <p className="max-w-xl text-lg text-white/85">{slide.description}</p>
                {slide.metrics && slide.metrics.length > 0 && (
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {slide.metrics.map((metric) => (
                      <div
                        key={`${slide.id}-${metric.label}`}
                        className="rounded-2xl border border-white/18 bg-white/12 px-4 py-3 text-left text-sm text-white/90 backdrop-blur-sm"
                      >
                        <dt className="text-xs uppercase tracking-wide text-white/70">{metric.label}</dt>
                        <dd className="text-xl font-semibold text-white">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="flex flex-wrap gap-3">
                  {renderCta(slide.primaryCta, 'primary')}
                  {renderCta(slide.secondaryCta, 'secondary')}
                  {renderCta(slide.tertiaryCta, 'outline')}
                </div>
                {slide.trustBadges && slide.trustBadges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
                    {slide.trustBadges.map((badge) => (
                      <span
                        key={`${slide.id}-${badge}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide"
                      >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-300" aria-hidden />
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <figure
                className={cx(
                  'relative flex items-center justify-center transition-all duration-700 ease-out motion-reduce:duration-0 motion-reduce:transform-none motion-reduce:opacity-100',
                  reveal ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
                )}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-card-glow opacity-70 blur-3xl" />
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={1600}
                  height={900}
                  className="relative h-auto w-full max-w-xl rounded-3xl border border-white/12 object-cover shadow-elevated"
                  loading={isActive ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </figure>
            </article>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-6 md:px-12">
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-badge backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Afficher la diapositive precedente"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-badge backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Afficher la diapositive suivante"
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
                'h-2.5 w-7 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                index === activeIndex ? 'bg-white' : 'bg-white/35 hover:bg-white/55',
              )}
              aria-label={`Aller vers ${slide.label}`}
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

