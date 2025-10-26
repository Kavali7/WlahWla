import React from 'react'
import { Button } from '../components/Button'

const About: React.FC = () => (
  <div className="space-y-10">
    <section className="rounded-3xl border border-surface-outline bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-700">
          WLAHWLA
        </span>
        <h2 className="text-2xl font-semibold text-secondary-800">Notre mission dans l espace UEMOA</h2>
        <p className="text-sm text-neutral-600">
          Accelere par waohdigital, WLAHWLA connecte les marchands et prestataires a des outils de vente, de relation client et de facturation concus pour les realites UEMOA.
        </p>
      </div>
    </section>

    <section id="roadmap" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">Roadmap produit</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">T4 2025</p>
          <ul className="mt-3 space-y-1">
            <li>- Paiement fractionne et QR code</li>
            <li>- Tableaux de bord multi-filiales</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">T1 2026</p>
          <ul className="mt-3 space-y-1">
            <li>- Catalogue multi devise</li>
            <li>- API partenaires logistique</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">T2 2026</p>
          <ul className="mt-3 space-y-1">
            <li>- Portail self-service clients</li>
            <li>- Automatisation recouvrement</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="partenaires" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">Programme partenaires</h3>
      <p className="text-sm text-neutral-600">
        Integrateurs, agences et cabinets comptables peuvent devenir relais locaux pour le deploiement et le support.
      </p>
      <Button size="sm" variant="secondary">
        Rejoindre le programme partenaires
      </Button>
    </section>

    <section id="talents" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">Talents</h3>
      <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
        <p className="font-semibold text-secondary-700">Postes ouverts</p>
        <ul className="mt-2 space-y-1">
          <li>- Product Manager Commerce (Dakar / Remote)</li>
          <li>- Customer Success Lead (Abidjan)</li>
          <li>- Ingenieur integration WhatsApp (Remote)</li>
        </ul>
      </div>
    </section>

    <section id="media" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">Presse et media</h3>
      <p className="text-sm text-neutral-600">
        Demandez notre dossier media avec logos, captures ecrans et points de contact officiels.
      </p>
      <Button size="sm" as="a" href="mailto:presse@wlahwla.com">
        Contacter l equipe communication
      </Button>
    </section>
  </div>
)

export default About
