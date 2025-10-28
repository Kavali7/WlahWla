import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { ServiceCard } from '../components/marketing/ServiceCard'
import { services } from '../content/home/services'

const Modules: React.FC = () => (
  <div className="space-y-12 pb-20">
    <section className="rounded-3xl border border-surface-outline bg-white px-8 py-12 shadow-elevated md:px-12">
      <div className="space-y-5 md:max-w-3xl">
        <span className="rounded-pill border border-surface-outlineStrong bg-surface-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
          Panorama modules
        </span>
        <h1 className="text-3xl font-semibold text-secondary-800 md:text-4xl">
          Commerce, finance, campagnes et support relies dans un meme cockpit
        </h1>
        <p className="text-sm text-neutral-600 md:text-base">
          Cette vue rassemble les quatre modules prioritaires definis avec marketing. Combinez-les pour lancer une experience omnicanale conforme UEMOA en moins de trois mois.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button as={Link} to="/essai-gratuit" size="md">
            Demander un essai
          </Button>
          <Button as={Link} to="/ressources#kit" variant="secondary" size="md">
            Consulter le kit adoption
          </Button>
        </div>
      </div>
    </section>
    <section className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <h2 className="text-2xl font-semibold text-secondary-800 md:text-3xl">Modules disponibles</h2>
        <p className="text-sm text-neutral-600 md:text-base">
          Chaque module inclut workflows, relances automatisables et tableaux de bord alignes avec les exigences UEMOA.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      <div className="rounded-3xl border border-dashed border-surface-outline bg-surface-muted px-6 py-8 md:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary-600">Feuille de route</p>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 md:text-base">
          Des modules complementaires (logistique, financement court terme, academie) seront ajoutes apres validation marketing. Ajoutez vos besoins dans le portail support pour prioriser les evolutions.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/a-propos#roadmap">
            Deposer une demande -&gt;
          </Link>
          <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/ressources#webinaires">
            Voir les prochains webinaires -&gt;
          </Link>
        </div>
      </div>
    </section>
  </div>
)

export default Modules
