import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

type ComplianceStatus = 'complete' | 'warning' | 'missing'

type OrganizationFormState = {
  name: string
  address: string
  country_code: string
  currency: string
  trade_register: string
  tax_id: string
  tax_enabled: boolean
  default_tax_rate: string
  whatsapp_number: string
  brand_color: string
  logo_url: string
}

type FieldErrorMap = Partial<Record<keyof OrganizationFormState, string>>

const defaultFormState: OrganizationFormState = {
  name: '',
  address: '',
  country_code: 'BJ',
  currency: 'XOF',
  trade_register: '',
  tax_id: '',
  tax_enabled: true,
  default_tax_rate: '18',
  whatsapp_number: '',
  brand_color: '#111827',
  logo_url: '',
}

const COUNTRY_OPTIONS = [
  { value: 'BJ', label: 'Bénin' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'CI', label: "Côte d'Ivoire" },
  { value: 'GW', label: 'Guinée-Bissau' },
  { value: 'ML', label: 'Mali' },
  { value: 'NE', label: 'Niger' },
  { value: 'SN', label: 'Sénégal' },
  { value: 'TG', label: 'Togo' },
]

const CURRENCY_OPTIONS = [
  { value: 'XOF', label: 'Franc CFA (XOF)' },
  { value: 'XAF', label: 'Franc CFA (XAF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar (USD)' },
]

const TAX_RATE_MIN = 0
const TAX_RATE_MAX = 25

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

const formatWhatsappNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (!digits.length) return ''
  if (!digits.startsWith('00') && !digits.startsWith('0') && !digits.startsWith('+')) {
    return digits.startsWith('229') ? digits : `229${digits}`
  }
  return digits.replace(/^00/, '')
}

const validateForm = (form: OrganizationFormState): FieldErrorMap => {
  const errors: FieldErrorMap = {}
  if (!form.name.trim()) {
    errors.name = "Le nom de l'organisation est obligatoire."
  }
  if (!form.trade_register.trim()) {
    errors.trade_register = 'Le registre du commerce est requis.'
  }
  if (!form.tax_id.trim()) {
    errors.tax_id = 'Le numéro fiscal est requis.'
  } else if (!/^[A-Za-z0-9\-\/]{4,64}$/.test(form.tax_id.trim())) {
    errors.tax_id = 'Format NIF invalide (4-64 lettres, chiffres, - ou /).'
  }
  if (!form.whatsapp_number.trim()) {
    errors.whatsapp_number = 'Le numéro WhatsApp est requis pour Click-to-Chat.'
  } else if (!/^\d{8,15}$/.test(form.whatsapp_number.trim())) {
    errors.whatsapp_number = 'Numéro WhatsApp invalide (8 à 15 chiffres).'
  }
  if (form.tax_enabled) {
    const numeric = Number(form.default_tax_rate)
    if (Number.isNaN(numeric)) {
      errors.default_tax_rate = 'Indiquez un taux de TVA numérique.'
    } else if (numeric < TAX_RATE_MIN || numeric > TAX_RATE_MAX) {
      errors.default_tax_rate = `Le taux doit être entre ${TAX_RATE_MIN}% et ${TAX_RATE_MAX}%.`
    }
  }
  return errors
}

const deriveComplianceStatus = (form: OrganizationFormState): ComplianceStatus => {
  const requiredFields: Array<keyof OrganizationFormState> = [
    'name',
    'trade_register',
    'tax_id',
    'whatsapp_number',
  ]
  const missingFields = requiredFields.filter((key) => !form[key].trim())
  if (missingFields.length === 0) {
    return 'complete'
  }
  if (missingFields.length <= 2) {
    return 'warning'
  }
  return 'missing'
}

const Settings: React.FC = () => {
  const { organization, updateOrganizationProfile } = useAuth()
  const [form, setForm] = useState<OrganizationFormState>(defaultFormState)
  const [status, setStatus] = useState<'idle' | 'saving'>('idle')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({})

  useEffect(() => {
    if (!organization) return
    setForm({
      name: organization.name ?? '',
      address: organization.address ?? '',
      country_code: organization.country_code ?? 'BJ',
      currency: organization.currency ?? 'XOF',
      trade_register: organization.trade_register ?? '',
      tax_id: organization.tax_id ?? '',
      tax_enabled: Boolean(organization.tax_enabled),
      default_tax_rate:
        organization.default_tax_rate !== undefined && organization.default_tax_rate !== null
          ? String(organization.default_tax_rate)
          : '18',
      whatsapp_number: organization.whatsapp_number ?? '',
      brand_color: organization.brand_color ?? '#111827',
      logo_url: organization.logo_url ?? '',
    })
  }, [organization])

  const complianceStatus = useMemo(() => deriveComplianceStatus(form), [form])

  const handleChange =
    (field: keyof OrganizationFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value =
        event.target.type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : event.target.value
      setForm((prev) => ({
        ...prev,
        [field]: field === 'whatsapp_number' ? value.replace(/[^\d+]/g, '') : value,
      }))
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedForm: OrganizationFormState = {
      ...form,
      name: normalizeWhitespace(form.name),
      address: form.address.trim(),
      trade_register: normalizeWhitespace(form.trade_register),
      tax_id: normalizeWhitespace(form.tax_id),
      whatsapp_number: formatWhatsappNumber(form.whatsapp_number),
    }
    const validationErrors = validateForm(trimmedForm)
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setError('Veuillez corriger les champs en surbrillance.')
      return
    }

    setStatus('saving')
    setFieldErrors({})
    setFeedback(null)
    setError(null)
    try {
      const payload = {
        ...trimmedForm,
        default_tax_rate: Number(trimmedForm.default_tax_rate || 0),
      }
      await updateOrganizationProfile(payload)
      setFeedback('Paramètres organisation enregistrés.')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer l'organisation.")
    } finally {
      setStatus('idle')
    }
  }

  const renderComplianceAlert = () => {
    if (complianceStatus === 'complete') {
      return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Vos informations UEMOA semblent complètes. Vous pouvez générer des documents fiscaux.
        </div>
      )
    }
    if (complianceStatus === 'warning') {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Certains champs réglementaires sont incomplets. Ajoutez votre NIF, registre ou contact WhatsApp
          pour éviter les rejets.
        </div>
      )
    }
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Complétez les informations obligatoires (registre, NIF, WhatsApp) pour respecter la conformité
        UEMOA.
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="grid gap-6 p-4">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-6 text-sm text-amber-700 shadow-soft">
          Aucune organisation sélectionnée. Connectez-vous avec un compte valide ou choisissez une
          organisation pour modifier ses paramètres.
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 p-4">
      <Card
        title="Paramètres de l'organisation"
        description="Mettez à jour vos informations légales, fiscales et de contact pour vos documents commerciaux."
        contentClassName="gap-4"
      >
        {renderComplianceAlert()}

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-soft">
            <header>
              <h2 className="text-sm font-semibold text-slate-900">Identité</h2>
              <p className="text-xs text-slate-500">
                Ces informations figurent sur vos factures et devis.
              </p>
            </header>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">Nom de l'organisation</span>
              <input
                className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Votre entreprise"
              />
              {fieldErrors.name && <span className="text-xs text-rose-600">{fieldErrors.name}</span>}
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">Adresse</span>
              <textarea
                className="min-h-[90px] rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={form.address}
                onChange={handleChange('address')}
                placeholder="Adresse complète"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">Pays</span>
                <select
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.country_code}
                  onChange={handleChange('country_code')}
                >
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">Devise</span>
                <select
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.currency}
                  onChange={handleChange('currency')}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-soft">
            <header>
              <h2 className="text-sm font-semibold text-slate-900">Informations fiscales</h2>
              <p className="text-xs text-slate-500">
                Requis pour la conformité UEMOA et l’émission des factures légales.
              </p>
            </header>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">Registre du commerce (RCCM)</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.trade_register}
                  onChange={handleChange('trade_register')}
                  placeholder="Ex: RCCM-COT-123456"
                />
                {fieldErrors.trade_register && (
                  <span className="text-xs text-rose-600">{fieldErrors.trade_register}</span>
                )}
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">Numéro fiscal (IFU/NIF)</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.tax_id}
                  onChange={handleChange('tax_id')}
                  placeholder="Ex: IFU123456789"
                />
                {fieldErrors.tax_id && (
                  <span className="text-xs text-rose-600">{fieldErrors.tax_id}</span>
                )}
              </label>
            </div>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-soft">
            <header>
              <h2 className="text-sm font-semibold text-slate-900">TVA</h2>
              <p className="text-xs text-slate-500">
                Activez la TVA par défaut sur vos documents et ajustez le taux à appliquer.
              </p>
            </header>
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.tax_enabled}
                onChange={handleChange('tax_enabled')}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
              />
              TVA activée
            </label>
            <label className="grid gap-1 text-sm md:w-48">
              <span className="font-semibold text-slate-700">Taux TVA (%)</span>
              <input
                className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={form.default_tax_rate}
                onChange={handleChange('default_tax_rate')}
                type="number"
                min={TAX_RATE_MIN}
                max={TAX_RATE_MAX}
                step="0.01"
                disabled={!form.tax_enabled}
              />
              {fieldErrors.default_tax_rate && (
                <span className="text-xs text-rose-600">{fieldErrors.default_tax_rate}</span>
              )}
            </label>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-soft">
            <header>
              <h2 className="text-sm font-semibold text-slate-900">Contact WhatsApp</h2>
              <p className="text-xs text-slate-500">
                Indispensable pour les paniers WhatsApp et les relances clients.
              </p>
            </header>
            <label className="grid gap-1 text-sm md:w-72">
              <span className="font-semibold text-slate-700">Numéro WhatsApp (international)</span>
              <input
                className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={form.whatsapp_number}
                onChange={handleChange('whatsapp_number')}
                placeholder="Ex: 22997000000"
              />
              {fieldErrors.whatsapp_number && (
                <span className="text-xs text-rose-600">{fieldErrors.whatsapp_number}</span>
              )}
            </label>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-soft">
            <header>
              <h2 className="text-sm font-semibold text-slate-900">Personnalisation</h2>
              <p className="text-xs text-slate-500">
                Couleurs et logo utilisés sur vos factures et dans la boutique.
              </p>
            </header>
            <div className="grid gap-3 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">Couleur principale (hex)</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 uppercase focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.brand_color}
                  onChange={handleChange('brand_color')}
                  placeholder="#111827"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">Logo URL</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={form.logo_url}
                  onChange={handleChange('logo_url')}
                  placeholder="https://..."
                  type="url"
                />
              </label>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          {feedback && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          )}

          <div>
            <Button type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Guide rapide :</span>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Complétez le registre du commerce et le numéro fiscal pour tous les documents.</li>
              <li>Activez la TVA si vous facturez avec taxe et renseignez le taux par défaut.</li>
              <li>Ajoutez un numéro WhatsApp afin d utiliser le panier et les relances.</li>
              <li>Personnalisez la couleur et le logo pour une identité cohérente.</li>
            </ul>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Settings
