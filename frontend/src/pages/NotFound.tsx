import React from 'react'
import { Button } from '../components/Button'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container flex min-h-[40vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="card max-w-lg px-10 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Erreur 404</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Page introuvable</h1>
        <p className="mt-3 text-sm text-slate-500">
          La ressource que vous cherchez a peut-etre ete deplacee ou n'existe plus. Verifiez l'URL ou
          revenez aux espaces principaux.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/" variant="primary">
            Tableau de bord
          </Button>
          <Button as={Link} to="/storefront" variant="secondary">
            Boutique
          </Button>
        </div>
      </div>
    </div>
  )
}
