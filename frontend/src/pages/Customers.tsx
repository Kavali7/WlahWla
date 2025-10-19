import React from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

export default function Customers() {
  return (
    <div className="grid gap-6">
      <Card
        title="Annuaire clients"
        description="Centralisez les informations de vos clients, attribuez des segments et suivez l'historique des commandes."
        actions={
          <Button variant="primary" size="sm">
            Nouveau client
          </Button>
        }
      >
        <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
          Aucun client enregistre pour le moment. Importez un fichier CSV ou creez un client pour
          commencer a suivre votre portefeuille.
        </div>
      </Card>
    </div>
  )
}
