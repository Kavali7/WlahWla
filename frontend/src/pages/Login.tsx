import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { persistAuthToken } from '../lib/auth'
import { Button } from '../components/Button'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) return
    setLoading(true)

    try {
      // Fake authentication while the real backend is implemented.
      await new Promise((resolve) => setTimeout(resolve, 600))
      persistAuthToken(`token-${Date.now()}`)
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="card w-full max-w-md px-8 py-10">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-display text-xl text-white shadow-soft">
              WL
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Connexion</h1>
            <p className="mt-2 text-sm text-slate-500">
              Connectez-vous pour acceder a vos tableaux, catalogues et parametres.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Adresse email
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Mot de passe
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
