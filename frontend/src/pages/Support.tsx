import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

const Support: React.FC = () => (
  <div className="space-y-10">
    <section className="rounded-3xl border border-surface-outline bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
          Support
        </span>
        <h2 className="text-2xl font-semibold text-secondary-800">Assistance, statut et securite</h2>
        <p className="text-sm text-neutral-600">
          Consultez cette page pour verifier l etat des services, contacter un conseiller et recuperer les elements de conformite.
        </p>
      </div>
    </section>

    <section id="status" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-secondary-800">Etat de la plateforme</h3>
        <Button as={Link} to="/essai-gratuit" size="sm" variant="secondary">
          Ouvrir un ticket prioritaire
        </Button>
      </div>
      <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-success-600">
          <span className="inline-flex h-3 w-3 rounded-full bg-success-500" aria-hidden="true" />
          Operations normales - derniers incidents resolus le 12 octobre a 09h30 GMT.
        </div>
        <ul className="mt-4 space-y-2 text-sm text-neutral-600">
          <li>- Maintenance planifiee: 30 octobre, 22h00 GMT (5 minutes, API facturation)</li>
          <li>- Derniere degradation: 08 octobre (retard webhooks), corrige en 14 minutes</li>
        </ul>
      </div>
    </section>

    <section id="securite" className="space-y-4">
      <h3 className="text-xl font-semibold text-secondary-800">Securite et SLA</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-secondary-800">Engagements SLA</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>- Disponibilite cible: 99.7 %</li>
            <li>- Support prioritaire: reponse en moins de 30 minutes (weekdays)</li>
            <li>- Escalade N2/N3 via canal WhatsApp dedie</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-secondary-800">Infrastructure</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>- Region principale: eu-west-3 (Paris)</li>
            <li>- Replication: zone secondaire eu-west-1 (Dublin)</li>
            <li>- Sauvegardes chiffrees, retention 30 jours</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="rgpd" className="space-y-4">
      <h3 className="text-xl font-semibold text-secondary-800">Conformite et RGPD</h3>
      <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
        <ul className="space-y-2 text-sm text-neutral-600">
          <li>- Sous-traitant principal: waohdigital (contrat cadre UEMOA)</li>
          <li>- Droit a l oubli: traites sous 48 heures ouvrables</li>
          <li>- Contact DPO: dpo@wlahwla.com</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
            href="https://wa.me/221778889900"
            target="_blank"
            rel="noreferrer"
          >
            Joindre le DPO {'->'}
          </a>
          <Button as={Link} to="/ressources#compliance" size="sm">
            Consulter les notes conformite
          </Button>
        </div>
      </div>
    </section>
  </div>
)

export default Support
