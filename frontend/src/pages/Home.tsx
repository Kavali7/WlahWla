import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { HeroCarousel } from '../components/media/HeroCarousel'
import { AdvertisingCard } from '../components/marketing/AdvertisingCard'
import { ServiceCard } from '../components/marketing/ServiceCard'
import { VerticalCard } from '../components/marketing/VerticalCard'
import { heroSlides } from '../content/hero-slides'
import { advertisingSpots } from '../content/advertising-spots'
import { services } from '../content/home/services'
import { verticalPreviews } from '../content/home/verticals'

type RevealOptions = {
  threshold?: number
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const useRevealOnScroll = (options?: RevealOptions) => {
  const threshold = options?.threshold ?? 0.25
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = React.useState(false)
  const reduceMotion = React.useRef(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  React.useEffect(() => {
    if (reduceMotion.current) {
      setVisible(true)
      return
    }
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            break
          }
        }
      },
      { threshold },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

const partnerLogos = [
  { id: 'waohdigital', name: 'waohdigital media' },
  { id: 'orange-money', name: 'Orange Money Pro' },
  { id: 'uba-connect', name: 'UBA Connect' },
  { id: 'ansie', name: 'ANSIE Lab' },
  { id: 'sunu', name: 'Sunu Assurance' },
] as const

const Home: React.FC = () => {
  const partnerBand = useRevealOnScroll({ threshold: 0.3 })
  const panoramaCard = useRevealOnScroll({ threshold: 0.25 })
  const servicesSection = useRevealOnScroll({ threshold: 0.25 })
  const verticalsSection = useRevealOnScroll({ threshold: 0.25 })

  return (
    <div className="space-y-16 pb-20">
      <HeroCarousel slides={heroSlides} className="mt-2" />

      <section
        ref={partnerBand.ref}
        aria-label="Partenaires strategiques"
        className={cx(
          'rounded-3xl border border-white/15 bg-secondary-900/70 px-6 py-6 text-white shadow-floating backdrop-blur-md md:px-10',
          'transition-all duration-700 ease-out motion-reduce:duration-0 motion-reduce:transform-none motion-reduce:opacity-100',
          partnerBand.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Reseau de confiance</p>
            <p className="text-sm text-white/85">
              Connecte aux operateurs telecom, banques et cabinets UEMOA pour orchestrer commerce, finance et campagnes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-white/85 sm:grid-cols-3 md:flex md:flex-wrap md:justify-end md:gap-4">
            {partnerLogos.map((logo) => (
              <span
                key={logo.id}
                className="inline-flex min-w-[140px] items-center justify-center rounded-2xl border border-white/22 bg-white/10 px-4 py-2 backdrop-blur"
              >
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="services"
        ref={servicesSection.ref}
        aria-labelledby="services-heading"
        className={cx(
          'space-y-10 rounded-3xl border border-surface-outline bg-white px-8 py-12 shadow-service md:px-12',
          'transition-all duration-700 ease-out motion-reduce:duration-0 motion-reduce:transform-none motion-reduce:opacity-100',
          servicesSection.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 lg:max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600/80">Nos offres prioritaires</p>
            <h2 id="services-heading" className="text-3xl font-semibold text-secondary-800 md:text-4xl">
              Les modules WLAHWLA pour orchestrer ventes, finance et marketing
            </h2>
            <p className="text-sm text-neutral-600 md:text-base">
              Chaque carte resume les workflows essentiels valides avec marketing. Activez vos equipes en sequence commerce, facturation, campagnes et support.
            </p>
          </div>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
        <div className="flex flex-col items-start gap-4 border-t border-surface-outline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">
            Accedez a la cartographie complete des modules commerce, finance, campagnes et support.
          </p>
          <Button as={Link} to="/modules" size="md">
            Explorer toutes les solutions
          </Button>
        </div>
      </section>

      <section
        id="verticales"
        ref={verticalsSection.ref}
        aria-labelledby="verticales-heading"
        className={cx(
          'space-y-10 rounded-3xl border border-surface-outline bg-white px-8 py-12 shadow-service md:px-12',
          'transition-all duration-700 ease-out motion-reduce:duration-0 motion-reduce:transform-none motion-reduce:opacity-100',
          verticalsSection.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 lg:max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600/80">Verticales prioritaires</p>
            <h2 id="verticales-heading" className="text-3xl font-semibold text-secondary-800 md:text-4xl">
              Des parcours valides avec marketing pour chaque industrie cible
            </h2>
            <p className="text-sm text-neutral-600 md:text-base">
              Choisissez la verticale qui correspond a votre equipe. Chaque fiche resume les workflows, KPIs et ressources a activer.
            </p>
          </div>
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {verticalPreviews.map((vertical) => (
            <VerticalCard key={vertical.id} {...vertical} />
          ))}
        </div>
        <div className="flex flex-col items-start gap-4 border-t border-surface-outline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">
            Accedez aux details par industrie: hero dedie, cas d usage, ressources et temoignages.
          </p>
          <Button as={Link} to="/verticals/retail" size="md">
            Voir les verticales
          </Button>
        </div>
      </section>

      <section
        ref={panoramaCard.ref}
        className={cx(
          'rounded-3xl border border-surface-outline bg-white px-8 py-10 shadow-elevated md:px-12',
          'transition-all duration-700 ease-out motion-reduce:duration-0 motion-reduce:transform-none motion-reduce:opacity-100',
          panoramaCard.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="rounded-pill border border-surface-outlineStrong bg-surface-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
              Panorama
            </span>
            <h2 className="text-3xl font-semibold text-secondary-800 md:text-4xl">
              Activez votre plateforme UEMOA en 72 heures chrono
            </h2>
            <p className="text-sm text-neutral-600 md:text-base">
              WLAHWLA aligne facturation, ventes omnicanales et campagnes waohdigital pour vos equipes finance, commerce et
              marketing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/essai-gratuit" size="md">
              Essayer gratuitement
            </Button>
            <Button as={Link} to="/ressources#demo" variant="secondary" size="md">
              Voir la demo
            </Button>
            <Button
              as="a"
              href="https://wa.me/221778889900?text=Bonjour%20WLAHWLA%2C%20je%20souhaite%20parler%20avec%20un%20conseiller."
              variant="outline"
              size="md"
              target="_blank"
              rel="noreferrer"
              aria-label="Contacter WLAHWLA sur WhatsApp"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section id="campagnes" className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-secondary-800 md:text-2xl">Campagnes publicitaires</h3>
          <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/ressources#campagnes">
            Guide campagne {'->'}
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {advertisingSpots.map((spot) => (
            <AdvertisingCard
              key={spot.id}
              badge={spot.badge}
              title={spot.title}
              description={spot.description}
              image={spot.image}
              imageAlt={spot.imageAlt}
              stats={spot.stats}
              cta={spot.cta}
            />
          ))}
        </div>
      </section>

      <section id="services-parcours" className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-secondary-800 md:text-2xl">Parcours services</h3>
          <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/ressources#onboarding">
            Checklist onboarding {'->'}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-floating">
            <h4 className="text-lg font-semibold text-secondary-800">Consultants B2B</h4>
            <p className="mt-2 text-sm text-neutral-600">
              Pipeline devis {'>'} contrats {'>'} factures avec signatures numeriques et relances automatisees.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              <li>- Assistant devis interactif</li>
              <li>- Portail client avec e-signature</li>
              <li>- Relances WhatsApp automatisees</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-floating" id="distribution">
            <h4 className="text-lg font-semibold text-secondary-800">Distribution multimarques</h4>
            <p className="mt-2 text-sm text-neutral-600">
              Synchronisez les catalogues, l inventaire temps reel et le recouvrement par filiale.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              <li>- Vue pipeline par zone de vente</li>
              <li>- Reapprovisionnement automatise</li>
              <li>- Reporting UEMOA consolide</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-floating" id="retail">
            <h4 className="text-lg font-semibold text-secondary-800">Retail et experience boutique</h4>
            <p className="mt-2 text-sm text-neutral-600">
              Unified commerce: encaissement, click and collect, suivi fidelite sur WhatsApp et USSD.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              <li>- Catalogue omnicanal</li>
              <li>- Paiement instantane et e-receipt</li>
              <li>- Campagnes personnalisables</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="temoignages" className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-secondary-800 md:text-2xl">Temoignages clients</h3>
          <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/ressources#webinaires">
            Replays webinaires {'->'}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-floating">
            <header className="flex items-center justify-between">
              <p className="text-sm font-semibold text-secondary-700">Sana Boutique - Dakar</p>
              <span className="text-xs font-semibold uppercase text-success-600">+42 % CA</span>
            </header>
            <p className="mt-3 text-sm text-neutral-600">
              Passage en boutique phygitale: configuration en 3 semaines avec integrateurs waohdigital.
            </p>
          </article>
          <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-floating">
            <header className="flex items-center justify-between">
              <p className="text-sm font-semibold text-secondary-700">Joli Service - Abidjan</p>
              <span className="text-xs font-semibold uppercase text-success-600">Temps devis divise par 2</span>
            </header>
            <p className="mt-3 text-sm text-neutral-600">
              Orchestration du flux devis {'>'} facture avec notifications WhatsApp signees.
            </p>
          </article>
        </div>
      </section>

      <section id="partenaires" className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-secondary-800 md:text-2xl">Partenaires waohdigital</h3>
          <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/a-propos#partenaires">
            Programme partenaires {'->'}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-dashed border-surface-outline p-6 text-sm text-neutral-600">
            <p className="font-semibold text-secondary-700">Telcos et paiement</p>
            <p className="mt-2">Passerelles mobile money, validations KYC et paiement a distance.</p>
          </div>
          <div className="rounded-2xl border border-dashed border-surface-outline p-6 text-sm text-neutral-600">
            <p className="font-semibold text-secondary-700">Fintech et credit</p>
            <p className="mt-2">Evaluation credit, financement court terme et assurance.</p>
          </div>
          <div className="rounded-2xl border border-dashed border-surface-outline p-6 text-sm text-neutral-600">
            <p className="font-semibold text-secondary-700">Integrateurs locaux</p>
            <p className="mt-2">Experts terrain pour parametrage, support et success plan.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
