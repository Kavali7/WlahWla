import React from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

export default function Settings() {
  return (
    <div className="grid gap-6">
      <Card
        title="Parametres de l'organisation"
        description="Modifiez les informations legales, les coordonnees de contact et les preferences de facture."
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Logo et identite</p>
                <p className="text-xs text-slate-500">
                  Telechargez un logo pour personnaliser vos factures et votre boutique.
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Mettre a jour
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Modes de paiement</p>
                <p className="text-xs text-slate-500">
                  Configurez les instructions de paiement mobile money, virement ou espece.
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Gerer
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
