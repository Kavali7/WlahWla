import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token || !password || !confirmation) {
      setError('Merci de completer tous les champs.')
      return
    }
    if (password !== confirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await resetPassword({ token, password, passwordConfirmation: confirmation })
      setDone(true)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; message?: string }>
      const message =
        axiosError.response?.data?.detail ??
        axiosError.response?.data?.message ??
        axiosError.message ??
        'Impossible de reinitialiser le mot de passe.'
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-display text-xl text-white shadow-soft">
              WL
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Reinitialiser le mot de passe</h1>
            <p className="mt-2 text-sm text-slate-500">
              Choisissez un nouveau mot de passe pour acceder a votre espace.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
            {done && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Mot de passe mis a jour. Redirection vers la connexion...
              </div>
            )}
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Code de reinitialisation
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Nouveau mot de passe
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Confirmation
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
              />
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? 'Mise a jour...' : 'Enregistrer le mot de passe'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-brand-600 transition-colors hover:text-brand-700">
              Retour a la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
