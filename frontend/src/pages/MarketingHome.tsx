import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

const MarketingHome: React.FC = () => (
  <div className="space-y-12">
    <section className="rounded-3xl border border-surface-outline bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
            Panorama
          </span>
          <h2 className="text-2xl font-semibold text-secondary-800">
            Concevez une experience client fluide du premier contact a la facture
          </h2>
          <p className="text-sm text-neutral-600">
            WLAHWLA s appuie sur le reseau waohdigital pour proposer des parcours omnicanaux adaptes aux
            marches UEMOA. Naviguez dans les segments ci-dessous et epinglez les modules qui vous interessent.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/essai-gratuit" size="sm">
            Demander une demo
          </Button>
          <Button as={Link} to="/ressources" variant="secondary" size="sm">
            Voir les ressources
          </Button>
        </div>
      </div>
    </section>

    <section id="services" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-secondary-800">Parcours services</h3>
        <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/ressources#onboarding">
          Checklist onboarding {'->'}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-secondary-800">Consultants B2B</h4>
          <p className="mt-2 text-sm text-neutral-600">
            Pipeline devis {'>'} contrats {'>'} factures avec signatures et collecte multicanale.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">
            <li>- Assistant devis interactif</li>
            <li>- Portail client avec e-signature</li>
            <li>- Relances WhatsApp automatisees</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm" id="distribution">
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
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm" id="retail">
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
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-secondary-800">Temoignages clients</h3>
        <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/ressources#webinaires">
          Replays webinaires {'->'}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <p className="text-sm font-semibold text-secondary-700">Sana Boutique - Dakar</p>
            <span className="text-xs font-semibold uppercase text-success-600">+42 % CA</span>
          </header>
          <p className="mt-3 text-sm text-neutral-600">
            Passage en boutique phygitale: configuration en 3 semaines avec integrateurs waohdigital.
          </p>
        </article>
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <p className="text-sm font-semibold text-secondary-700">Joli Service - Abidjan</p>
            <span className="text-xs font-semibold uppercase text-success-600">Temps devise divise par 2</span>
          </header>
          <p className="mt-3 text-sm text-neutral-600">
            Orchestration du flux devis {'>'} facture avec notifications WhatsApp signees.
          </p>
        </article>
      </div>
    </section>

    <section id="partenaires" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-secondary-800">Partenaires waohdigital</h3>
        <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/a-propos#partenaires">
          Programme partenaires {'->'}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-dashed border-surface-outline p-6 text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">Telcos & paiement</p>
          <p className="mt-2">
            Passerelles mobile money, validations KYC et Paiement a distance.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-surface-outline p-6 text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">Fintech et credit</p>
          <p className="mt-2">
            Evaluation credit, financement court terme et assurance.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-surface-outline p-6 text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">Integrateurs locaux</p>
          <p className="mt-2">
            Experts terrain pour parametrage, support et success plan.</p>
        </div>
      </div>
    </section>
  </div>
)

export default MarketingHome
