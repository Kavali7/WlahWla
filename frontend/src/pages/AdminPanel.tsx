import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

const asArray = (payload: any): any[] =>
  Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : []

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [org, setOrg] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [form, setForm] = useState({ username: '', email: '' })

  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [savingOrg, setSavingOrg] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const [usersResponse, orgsResponse, membershipsResponse] = await Promise.all([
        api.get('/users/'),
        api.get('/organizations/'),
        api.get('/memberships/'),
      ])
      setUsers(asArray(usersResponse.data))
      const organizations = asArray(orgsResponse.data)
      setOrg(organizations[0] ?? null)
      setMembers(asArray(membershipsResponse.data))
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les donnees administrateur. Verifiez votre connexion."
      setError(message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCreateUser = async () => {
    if (!form.username.trim() || !form.email.trim()) return
    setCreatingUser(true)
    setFeedback(null)
    setActionError(null)
    try {
      await api.post('/users/', form)
      setForm({ username: '', email: '' })
      setFeedback('Utilisateur cree avec succes.')
      await load()
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Impossible de creer l'utilisateur. Reessayez ou verifiez votre connexion.",
      )
    } finally {
      setCreatingUser(false)
    }
  }

  const handleSaveOrganization = async () => {
    if (!org) return
    setSavingOrg(true)
    setFeedback(null)
    setActionError(null)
    try {
      await api.patch(`/organizations/${org.id}/`, org)
      setFeedback('Organisation mise a jour.')
      await load()
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible d'enregistrer l'organisation.",
      )
    } finally {
      setSavingOrg(false)
    }
  }

  const handleUpdateMember = async (membership: any, role: string) => {
    setUpdatingRoleId(membership.id)
    setFeedback(null)
    setActionError(null)
    try {
      await api.patch(`/memberships/${membership.id}/`, { role })
      setFeedback('Role mis a jour.')
      await load()
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible de mettre a jour le role du membre.",
      )
    } finally {
      setUpdatingRoleId(null)
    }
  }

  const handleOrgChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : event.target.value
      setOrg((prev: any) => ({ ...prev, [field]: value }))
    }

  const disableCreateUser =
    creatingUser || !form.username.trim().length || !form.email.trim().length

  return (
    <div className="grid gap-4 p-4">
      {status === 'loading' && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600 shadow-sm">
          Chargement des donnees administrateur...
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700 shadow-sm">
          {error}
          <div className="mt-3">
            <Button size="sm" variant="ghost" onClick={load}>
              Reessayer
            </Button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedback}
        </div>
      )}
      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </div>
      )}

      <Card title="Param��tres de l'organisation">
        {status === 'loading' && (
          <div className="h-40 rounded-2xl bg-slate-200/60 animate-pulse" />
        )}
        {status === 'success' && org && (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span>Nom</span>
              <input className="border rounded px-2 py-1" value={org.name ?? ''} onChange={handleOrgChange('name')} />
            </label>
            <label className="grid gap-1">
              <span>Code org</span>
              <input className="border rounded px-2 py-1" value={org.org_code ?? ''} onChange={handleOrgChange('org_code')} />
            </label>
            <label className="grid gap-1">
              <span>Pays</span>
              <select className="border rounded px-2 py-1" value={org.country_code ?? 'BJ'} onChange={handleOrgChange('country_code')}>
                {['BJ','BF','CI','GW','ML','NE','SN','TG'].map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span>Devise</span>
              <input className="border rounded px-2 py-1" value={org.currency ?? 'XOF'} onChange={handleOrgChange('currency')} />
            </label>
            <label className="grid gap-1">
              <span>Adresse</span>
              <input className="border rounded px-2 py-1" value={org.address ?? ''} onChange={handleOrgChange('address')} />
            </label>
            <label className="grid gap-1">
              <span>RCCM</span>
              <input className="border rounded px-2 py-1" value={org.trade_register ?? ''} onChange={handleOrgChange('trade_register')} />
            </label>
            <label className="grid gap-1">
              <span>IFU</span>
              <input className="border rounded px-2 py-1" value={org.tax_id ?? ''} onChange={handleOrgChange('tax_id')} />
            </label>
            <label className="grid gap-1 flex items-center gap-2">
              <span>Taxe activee</span>
              <input type="checkbox" checked={Boolean(org.tax_enabled)} onChange={handleOrgChange('tax_enabled')} />
            </label>
            <label className="grid gap-1">
              <span>Taux taxe (%)</span>
              <input
                className="border rounded px-2 py-1"
                type="number"
                step="0.01"
                value={org.default_tax_rate ?? 18}
                onChange={(event) =>
                  setOrg((prev: any) => ({
                    ...prev,
                    default_tax_rate: parseFloat(event.target.value || '0'),
                  }))
                }
              />
            </label>
            <label className="grid gap-1">
              <span>Couleur (hex)</span>
              <input className="border rounded px-2 py-1" value={org.brand_color ?? '#111827'} onChange={handleOrgChange('brand_color')} />
            </label>
            <label className="grid gap-1">
              <span>Logo URL</span>
              <input className="border rounded px-2 py-1" value={org.logo_url ?? ''} onChange={handleOrgChange('logo_url')} />
            </label>
            <label className="grid gap-1">
              <span>WhatsApp</span>
              <input className="border rounded px-2 py-1" value={org.whatsapp_number ?? ''} onChange={handleOrgChange('whatsapp_number')} />
            </label>
            <div className="col-span-full">
              <Button onClick={handleSaveOrganization} disabled={savingOrg}>
                {savingOrg ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        )}
        {status === 'success' && !org && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
            Aucune organisation n'a encore ete configuree.
          </div>
        )}
      </Card>

  <Card title="Utilisateurs">
        <div className="mb-3 flex flex-wrap gap-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Button onClick={handleCreateUser} disabled={disableCreateUser}>
            {creatingUser ? 'Creation...' : 'Creer'}
          </Button>
        </div>
        {status === 'loading' ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
            Chargement des utilisateurs...
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
            Aucun utilisateur a afficher.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr><th>Username</th><th>Email</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="R��les & permissions">
        {status === 'loading' ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
            Chargement des membres...
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
            Aucun membre a afficher.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr><th>ID</th><th>Org</th><th>R��le</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {members.map((membership: any) => (
                <tr key={membership.id}>
                  <td>{membership.user}</td>
                  <td>{membership.organization}</td>
                  <td>{membership.role}</td>
                  <td className="flex flex-wrap gap-2 py-1">
                    {['ADMIN','ACCOUNTANT','SALES','WAREHOUSE','VIEWER'].map((role) => (
                      <button
                        key={role}
                        className="btn text-xs"
                        onClick={() => handleUpdateMember(membership, role)}
                        disabled={updatingRoleId === membership.id}
                      >
                        {role}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
