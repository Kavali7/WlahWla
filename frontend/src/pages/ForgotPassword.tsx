import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return

    setLoading(true)
    setError(null)

    try {
      await requestPasswordReset(email)
      setDone(true)
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; message?: string }>
      const message =
        axiosError.response?.data?.detail ??
        axiosError.response?.data?.message ??
        axiosError.message ??
        'Impossible denvoyer les instructions.'
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
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Mot de passe oublie</h1>
            <p className="mt-2 text-sm text-slate-500">
              Renseignez votre adresse email pour recevoir un lien de reinitialisation.
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
                Si le compte existe, un email contenant les instructions a ete envoye.
              </div>
            )}
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Adresse email
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer les instructions'}
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
