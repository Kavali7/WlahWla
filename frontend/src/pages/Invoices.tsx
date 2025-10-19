import React from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

export default function Invoices() {
  return (
    <div className="grid gap-6">
      <Card
        title="Factures"
        description="Generez et suivez vos factures, statut de paiement et relances automatiques."
        actions={
          <Button variant="primary" size="sm">
            Nouvelle facture
          </Button>
        }
      >
        <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
          Vos factures en cours seront affichees ici. Connectez l'application au backend pour recuperer
          l'historique ou commencez par en creer une nouvelle.
        </div>
      </Card>
    </div>
  )
}
