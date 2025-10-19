import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './Button'

const fieldLabels: Record<string, string> = {
  address: "Adresse de l'entreprise",
  tax_id: 'Numero fiscal',
  trade_register: 'Registre de commerce',
  organization_profile: 'Profil organisation',
}

type FormState = {
  address: string
  tax_id: string
  trade_register: string
}

const initialForm: FormState = {
  address: '',
  tax_id: '',
  trade_register: '',
}

export default function OrganizationOnboardingCard() {
  const {
    organization,
    organizationChecklist,
    requiresOrganizationSetup,
    updateOrganizationProfile,
  } = useAuth()
  const [form, setForm] = useState<FormState>(initialForm)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setForm({
      address: organization?.address ?? '',
      tax_id: organization?.tax_id ?? '',
      trade_register: organization?.trade_register ?? '',
    })
  }, [organization?.id, organization?.address, organization?.tax_id, organization?.trade_register])

  const requiredFields = useMemo(() => {
    const mapped = organizationChecklist
      .map((field) => fieldLabels[field] ?? field)
      .filter((value, index, self) => value && self.indexOf(value) === index)
    return mapped
  }, [organizationChecklist])

  if (!requiresOrganizationSetup || !organization) {
    return null
  }

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setStatusMessage(null)
    setErrorMessage(null)

    try {
      await updateOrganizationProfile(form)
      setStatusMessage('Profil mis a jour avec succes.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'enregistrer les informations requises.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-6 text-sm text-amber-900 shadow-soft">
      <header className="mb-4 flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Onboarding requis</p>
        <h2 className="text-lg font-semibold text-amber-900">
          Completez le profil de {organization.name ?? 'votre organisation'}
        </h2>
        {requiredFields.length > 0 && (
          <p className="text-xs text-amber-700">
            Champs a renseigner : {requiredFields.join(', ')}.
          </p>
        )}
      </header>
      <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Adresse</span>
          <input
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={form.address}
            onChange={handleChange('address')}
            placeholder="Quartier, ville..."
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Numero fiscal</span>
          <input
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={form.tax_id}
            onChange={handleChange('tax_id')}
            placeholder="Ex: IFU..."
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Registre de commerce</span>
          <input
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={form.trade_register}
            onChange={handleChange('trade_register')}
            placeholder="RCCM / Numero de registre"
            required
          />
        </label>
        <div className="md:col-span-3 flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? 'Enregistrement en cours...' : 'Enregistrer'}
          </Button>
          {statusMessage && <span className="text-xs text-emerald-700">{statusMessage}</span>}
          {errorMessage && <span className="text-xs text-rose-700">{errorMessage}</span>}
        </div>
      </form>
    </section>
  )
}
