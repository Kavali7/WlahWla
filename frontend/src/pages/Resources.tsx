import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

const Resources: React.FC = () => (
  <div className="space-y-10">
    <section className="rounded-3xl border border-surface-outline bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-700">
            Kit equipes
          </span>
          <h2 className="text-2xl font-semibold text-secondary-800">Tout ce qu il faut pour lancer WLAHWLA</h2>
          <p className="text-sm text-neutral-600">
            Retrouvez les checklists de preparation, les scripts d annonce et les replays des ateliers pour
            acculturer vos equipes commerciales, finances et support.
          </p>
        </div>
        <Button as={Link} to="/essai-gratuit" size="sm">
          Planifier un coaching
        </Button>
      </div>
    </section>

    <section id="onboarding" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">1. Checklists onboarding</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-secondary-800">Semaine -1</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>- Inventorier les canaux de vente existants</li>
            <li>- Preparer les fichiers clients et produits</li>
            <li>- Identifier un sponsor projet et un referent support</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-secondary-800">Jour J</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>- Configurer les equipes et circuit de validation</li>
            <li>- Activer le canal WhatsApp et valider les templates</li>
            <li>- Planifier un check post-lancement a J+7</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="webinaires" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-secondary-800">2. Webinaires et replays</h3>
        <Link className="text-sm font-semibold text-primary-600 hover:text-primary-500" to="/support#status">
          Statut plateforme {'->'}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-secondary-700">Commerce omnicanal</p>
          <p className="mt-2 text-sm text-neutral-600">Transformer un panier WhatsApp en facture en moins de 5 minutes.</p>
          <a
            className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:text-primary-500"
            href="https://wa.me/221778889900"
            target="_blank"
            rel="noreferrer"
          >
            Recevoir le replay {'->'}
          </a>
        </article>
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-secondary-700">Gestion des stocks</p>
          <p className="mt-2 text-sm text-neutral-600">Pilotage multi-entrepots et alerte sur ruptures lunes.</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:text-primary-500" to="/admin/inventory">
            Voir la demo {'->'}
          </Link>
        </article>
        <article className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-secondary-700">Finances et recouvrement</p>
          <p className="mt-2 text-sm text-neutral-600">Automatiser les relances et proposer le paiement fractionne.</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:text-primary-500" to="/admin/invoices">
            Workflow factures {'->'}
          </Link>
        </article>
      </div>
    </section>

    <section id="compliance" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">3. Notes conformite UEMOA</h3>
      <div className="space-y-2 text-sm text-neutral-600">
        <p>- Harmonisation TVA et mentions legales facture</p>
        <p>- Politique de retention des donnees et archivage</p>
        <p>- Obligations de double validation pour la facturation digitale</p>
      </div>
    </section>

    <section id="kit" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">4. Kit adoption interne</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">Scripts annonce managers</p>
          <p className="mt-2">Modeles slack/email pour expliquer le deploiement et cadrer le support.</p>
        </div>
        <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">Checkpoints data</p>
          <p className="mt-2">Guide de nettoyage fichiers clients et produits avant import.</p>
        </div>
        <div className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm text-sm text-neutral-600">
          <p className="font-semibold text-secondary-700">Kit communication</p>
          <p className="mt-2">Visuels, carrousels WhatsApp, affichettes point de vente.</p>
        </div>
      </div>
    </section>

    <section id="forum" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">5. Communautes et feedback</h3>
      <p className="text-sm text-neutral-600">
        Rejoignez la boucle Telegram et les sessions beta pour acceder aux nouvelles fonctionnalites avant tout le monde.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button as={Link} to="/support#rgpd" variant="secondary" size="sm">
          Politique RGPD
        </Button>
          <a
            className="inline-flex items-center rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
            href="https://wa.me/221778889900"
            target="_blank"
            rel="noreferrer"
          >
            Canal WhatsApp VIP {'->'}
          </a>
      </div>
    </section>

    <section id="academy" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">6. Academie WLAHWLA</h3>
      <p className="text-sm text-neutral-600">
        Parcours self service pour les nouveaux collaborateurs: 5 modules video, quiz et plan d action.
      </p>
    </section>

    <section id="agenda" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">7. Agenda terrain</h3>
      <ul className="space-y-2 text-sm text-neutral-600">
        <li>- Dakar Retail Days, 12 novembre</li>
        <li>- Abidjan Service Summit, 20 novembre</li>
        <li>- Webinaire quarter review, 3 decembre</li>
      </ul>
    </section>

    <section id="newsletter" className="space-y-3">
      <h3 className="text-xl font-semibold text-secondary-800">8. Newsletter produit</h3>
      <p className="text-sm text-neutral-600">
        Recevez chaque mois les evolutions produit, les cas clients et les evenements partenaires.
      </p>
      <form className="flex flex-col gap-3 sm:flex-row">
        <input
          className="h-11 flex-1 rounded-xl border border-surface-outline bg-white px-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          type="email"
          name="email"
          placeholder="email@entreprise.com"
          aria-label="Adresse email"
        />
        <Button type="submit" size="sm">
          Je m inscris
        </Button>
      </form>
    </section>
  </div>
)

export default Resources
