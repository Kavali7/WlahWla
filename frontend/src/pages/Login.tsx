import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [from, isAuthenticated, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) return

    setLoading(true)
    setError(null)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; message?: string }>
      const message =
        axiosError.response?.data?.detail ??
        axiosError.response?.data?.message ??
        axiosError.message ??
        'Impossible de se connecter.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="card w-full max-w-md px-8 py-10">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 font-display text-xl text-white shadow-floating">
              WL
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Connexion</h1>
            <p className="mt-2 text-sm text-slate-500">
              Connectez-vous pour acceder a vos tableaux, catalogues et parametres.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Adresse email
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Mot de passe
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                Mot de passe oublie ?
              </Link>
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
