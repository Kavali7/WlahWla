import React from 'react'
import { Button } from '../components/Button'

const Trial: React.FC = () => (
  <div className="space-y-8">
    <section className="rounded-3xl border border-surface-outline bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-secondary-800">Demandez un essai accompagne</h2>
        <p className="text-sm text-neutral-600">
          L equipe waohdigital configure avec vous un espace pilote (catalogue, equipes, canaux WhatsApp) et suit les premiers cas clients pendant 14 jours.
        </p>
      </div>
    </section>
    <section className="rounded-2xl border border-surface-outline bg-white p-6 shadow-sm">
      <form className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-secondary-700">
          Organisation
          <input
            className="h-11 rounded-xl border border-surface-outline bg-white px-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            name="company"
            placeholder="Entreprise"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-secondary-700">
          Email professionnel
          <input
            className="h-11 rounded-xl border border-surface-outline bg-white px-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            type="email"
            name="email"
            placeholder="vous@entreprise.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-secondary-700 md:col-span-2">
          Objectifs principaux
          <textarea
            className="min-h-[120px] rounded-xl border border-surface-outline bg-white px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            name="goals"
            placeholder="Expliquez le contexte (ex: automatiser les devis, centraliser les paiements...)"
          />
        </label>
        <div className="md:col-span-2">
          <Button type="submit" size="sm">Envoyer la demande</Button>
        </div>
      </form>
    </section>
  </div>
)

export default Trial
