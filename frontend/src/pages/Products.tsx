import React from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

export default function Products() {
  return (
    <div className="grid gap-6">
      <Card
        title="Catalogue produits"
        description="Configurez vos articles, prix et disponibilites pour la boutique et les devis."
        actions={
          <Button variant="primary" size="sm">
            Nouveau produit
          </Button>
        }
      >
        <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
          La liste de vos produits apparaitra ici. Connectez-vous a l'API ou activez la synchronisation
          avec l'inventaire pour charger les donnees.
        </div>
      </Card>
    </div>
  )
}
