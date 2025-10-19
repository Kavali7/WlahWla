import React from 'react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import { Button } from './Button'

export default function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const status = isRouteErrorResponse(error) ? error.status : 500
  const message = isRouteErrorResponse(error)
    ? error.statusText || 'Une erreur est survenue.'
    : error instanceof Error
    ? error.message
    : 'Une erreur inattendue est survenue.'

  return (
    <div className="container flex min-h-[40vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="card max-w-md px-8 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Erreur {status}</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Impossible d'afficher cette page</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button onClick={() => navigate('/', { replace: true })}>Aller au tableau de bord</Button>
        </div>
      </div>
    </div>
  )
}
