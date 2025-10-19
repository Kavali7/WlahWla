import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

type MembershipRole = 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'WAREHOUSE' | 'VIEWER'

const ROLE_OPTIONS: Array<{ value: MembershipRole; label: string }> = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'ACCOUNTANT', label: 'Comptable' },
  { value: 'SALES', label: 'Commercial' },
  { value: 'WAREHOUSE', label: 'Logistique' },
  { value: 'VIEWER', label: 'Lecture seule' },
]

const MANAGEMENT_ROLES: MembershipRole[] = ['ADMIN']

type User = {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_active: boolean
}

type Membership = {
  id: number
  organization: number
  user: number
  role: MembershipRole
  is_active: boolean
}

type MemberRow = {
  membership: Membership
  user: User | null
}

type InvitationFormState = {
  email: string
  name: string
  role: MembershipRole
}

type InvitationMessageInput = {
  email: string
  name?: string
  organizationName?: string
  roleLabel: string
}

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const getErrorMessage = (error: any): string => {
  if (error?.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (typeof data?.detail === 'string') return data.detail
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`,
        )
        .join(' | ')
    }
  }
  if (error?.message) return error.message
  return "Une erreur inattendue s'est produite."
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const generateUsernameFromEmail = (email: string) => {
  const base = normalizeEmail(email).split('@')[0] ?? 'user'
  const sanitized = base.replace(/[^a-zA-Z0-9._-]/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return sanitized ? `${sanitized}-${suffix}` : `user-${suffix}`
}

const buildInvitationMessage = ({
  email,
  name,
  organizationName,
  roleLabel,
}: InvitationMessageInput) => {
  const greeting = name ? `Bonjour ${name},` : 'Bonjour,'
  const orgSegment = organizationName ? ` au sein de ${organizationName}` : ''
  const link = `${window.location.origin}/login`
  return [
    greeting,
    '',
    `Vous etes invite(e) a rejoindre l'espace ${roleLabel}${orgSegment}.`,
    `Connectez-vous en utilisant votre adresse ${email} en visitant le lien suivant :`,
    link,
    '',
    'Si vous n attendiez pas cette invitation, ignorez ce message.',
  ].join('\n')
}

const defaultInvitationForm: InvitationFormState = {
  email: '',
  name: '',
  role: 'VIEWER',
}

const AdminPanel: React.FC = () => {
  const { user: authUser, organization } = useAuth()
  const organizationId = organization?.id ? String(organization.id) : null
  const organizationDetails = organization as Record<string, any> | null
  const organizationName = (organizationDetails?.name as string) ?? undefined
  const organizationCurrency = (organizationDetails?.currency as string) ?? 'XOF'
  const organizationCode =
    (organizationDetails?.code as string) ??
    (organizationDetails?.org_code as string) ??
    undefined
  const organizationWhatsapp =
    (organizationDetails?.whatsapp_number as string) ?? undefined

  const [status, setStatus] = useState<FetchStatus>('idle')
  const [users, setUsers] = useState<User[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [inviteForm, setInviteForm] = useState<InvitationFormState>(defaultInvitationForm)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [invitePreview, setInvitePreview] = useState<string | null>(null)

  const [updatingMemberId, setUpdatingMemberId] = useState<number | null>(null)
  const [togglingMemberId, setTogglingMemberId] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!organizationId) return
    setStatus('loading')
    setError(null)
    try {
      const [usersResponse, membershipsResponse] = await Promise.all([
        api.get('/users/'),
        api.get('/memberships/', { params: { organization: organizationId } }),
      ])
      const allUsers = asArray<User>(usersResponse.data)
      const allMemberships = asArray<Membership>(membershipsResponse.data).filter(
        (membership) => String(membership.organization) === organizationId,
      )

      setUsers(allUsers)
      setMemberships(allMemberships)
      setStatus('success')
    } catch (err) {
      setError(getErrorMessage(err))
      setStatus('error')
    }
  }, [organizationId])

  useEffect(() => {
    if (organizationId) {
      load()
    }
  }, [load, organizationId])

  const currentUserId = authUser?.id ? Number(authUser.id) : null

  const currentMembership = useMemo(
    () =>
      currentUserId
        ? memberships.find(
            (membership) => Number(membership.user) === currentUserId,
          )
        : undefined,
    [currentUserId, memberships],
  )

  const canManageMembers =
    !!currentMembership && MANAGEMENT_ROLES.includes(currentMembership.role)

  const memberRows: MemberRow[] = useMemo(() => {
    const sorted = [...memberships].sort((a, b) => {
      if (a.is_active !== b.is_active) return a.is_active ? -1 : 1
      return a.role.localeCompare(b.role)
    })
    return sorted.map((membership) => {
      const user = users.find((candidate) => Number(candidate.id) === Number(membership.user)) ?? null
      return { membership, user }
    })
  }, [memberships, users])

  const handleInviteFieldChange =
    (field: keyof InvitationFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setInviteForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSendInvitation = async () => {
    if (!organizationId) {
      setActionError("Aucune organisation selectionnee.")
      return
    }
    const email = normalizeEmail(inviteForm.email)
    if (!email) {
      setActionError('Veuillez renseigner une adresse email valide.')
      return
    }

    setInviteLoading(true)
    setFeedback(null)
    setActionError(null)
    setInvitePreview(null)

    try {
      const existingUser =
        users.find((candidate) => normalizeEmail(candidate.email) === email) ?? null

      let userId: number
      let createdUser = false

      if (existingUser) {
        userId = existingUser.id
      } else {
        const username = generateUsernameFromEmail(email)
        const response = await api.post('/users/', {
          username,
          email,
          first_name: inviteForm.name || undefined,
          is_active: false,
        })
        const newUser = response.data as User
        userId = newUser.id
        createdUser = true
      }

      const existingMembership =
        memberships.find((membership) => Number(membership.user) === Number(userId)) ?? null

      if (existingMembership) {
        await api.patch(`/memberships/${existingMembership.id}/`, {
          role: inviteForm.role,
          is_active: false,
        })
      } else {
        await api.post('/memberships/', {
          organization: organizationId,
          user: userId,
          role: inviteForm.role,
          is_active: false,
        })
      }

      await load()

      const roleLabel =
        ROLE_OPTIONS.find((item) => item.value === inviteForm.role)?.label ?? inviteForm.role

      const message = buildInvitationMessage({
        email,
        name: inviteForm.name,
        organizationName,
        roleLabel,
      })

      setInvitePreview(message)
      setFeedback(
        createdUser
          ? 'Invitation creee. Copiez le message ci-dessous pour l envoyer au collaborateur.'
          : 'Invitation mise a jour. Copiez le message ci-dessous pour l envoyer au collaborateur.',
      )
      setInviteForm((prev) => ({ ...defaultInvitationForm, role: prev.role }))
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRoleChange = async (membership: Membership, role: MembershipRole) => {
    setUpdatingMemberId(membership.id)
    setFeedback(null)
    setActionError(null)
    try {
      await api.patch(`/memberships/${membership.id}/`, { role })
      await load()
      setFeedback('Role mis a jour.')
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setUpdatingMemberId(null)
    }
  }

  const handleToggleActive = async (membership: Membership, nextActive: boolean) => {
    setTogglingMemberId(membership.id)
    setFeedback(null)
    setActionError(null)
    try {
      await api.patch(`/memberships/${membership.id}/`, { is_active: nextActive })
      await load()
      setFeedback(nextActive ? 'Membre reactiver.' : 'Membre suspendu.')
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setTogglingMemberId(null)
    }
  }

  const handleCopyInvitation = async (row: MemberRow) => {
    if (!row.user?.email) {
      setActionError('Adresse email introuvable pour ce membre.')
      return
    }
    const roleLabel =
      ROLE_OPTIONS.find((item) => item.value === row.membership.role)?.label ??
      row.membership.role
    const message = buildInvitationMessage({
      email: row.user.email,
      name: row.user.first_name || row.user.username,
      organizationName,
      roleLabel,
    })
    try {
      await navigator.clipboard.writeText(message)
      setFeedback(`Invitation copiee dans le presse-papier pour ${row.user.email}.`)
    } catch {
      setInvitePreview(message)
      setActionError(
        "Impossible de copier automatiquement. Copiez le message ci-dessous manuellement.",
      )
    }
  }

  const disableInvite =
    inviteLoading || !normalizeEmail(inviteForm.email)

  const showGuardMessage =
    status === 'success' && !canManageMembers

  return (
    <div className="grid gap-4 p-4">
      {status === 'loading' && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600 shadow-sm">
          Chargement des informations administration…
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {showGuardMessage && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-6 text-sm text-amber-700 shadow-soft">
          Vous n avez pas les permissions necessaires pour gerer les collaborateurs. Contactez un
          administrateur.
        </div>
      )}

      {organization && (
        <Card
          title="Informations organisation"
          description="Ces informations sont visibles des collaborateurs invites."
          contentClassName="gap-3 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Nom</span>
            <div>{organizationName ?? 'Non renseigne'}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Devise</span>
            <div>{organizationCurrency}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Code organisation</span>
            <div>{organizationCode ?? '-'}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">WhatsApp</span>
            <div>{organizationWhatsapp ?? 'Non renseigne'}</div>
          </div>
        </Card>
      )}

      {canManageMembers && (
        <Card
          title="Inviter un collaborateur"
          description="Creez une invitation en renseignant le role attendu. Copiez ensuite le message genere."
          contentClassName="gap-3"
        >
          <div className="grid gap-3 md:grid-cols-[2fr_1.2fr_1fr]">
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Email"
              value={inviteForm.email}
              onChange={handleInviteFieldChange('email')}
              type="email"
            />
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Nom (facultatif)"
              value={inviteForm.name}
              onChange={handleInviteFieldChange('name')}
            />
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={inviteForm.role}
              onChange={handleInviteFieldChange('role')}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSendInvitation} disabled={disableInvite}>
              {inviteLoading ? 'Preparation...' : 'Generer linvitation'}
            </Button>
            <Button variant="ghost" onClick={() => setInviteForm(defaultInvitationForm)} disabled={inviteLoading}>
              Reinitialiser
            </Button>
          </div>

          {invitePreview && (
            <div className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Message a envoyer
              </span>
              <textarea
                className="min-h-[160px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                readOnly
                value={invitePreview}
              />
            </div>
          )}
        </Card>
      )}

      {canManageMembers && (
        <Card
          title="Membres de l'organisation"
          description="Modifiez les roles, suspendez ou renvoyez une invitation."
          contentClassName="gap-3"
        >
          {status === 'success' && memberRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
              Aucun collaborateur pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Collaborateur</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {memberRows.map((row) => {
                    const { membership, user } = row
                    const displayName =
                      user?.first_name || user?.username || user?.email || `Utilisateur #${membership.user}`
                    const inviteeEmail = user?.email ?? ''
                    const isActive = membership.is_active
                    return (
                      <tr key={membership.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                          {inviteeEmail && (
                            <div className="text-xs text-slate-500">{inviteeEmail}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            value={membership.role}
                            onChange={(event) =>
                              handleRoleChange(membership, event.target.value as MembershipRole)
                            }
                            disabled={updatingMemberId === membership.id}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              isActive
                                ? 'rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600'
                                : 'rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600'
                            }
                          >
                            {isActive ? 'Actif' : 'Invitation en attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleToggleActive(membership, !isActive)}
                              disabled={togglingMemberId === membership.id}
                            >
                              {isActive ? 'Suspendre' : 'Reactiver'}
                            </Button>
                            {!isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyInvitation(row)}
                              >
                                Copier linvitation
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {feedback && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm text-emerald-700 shadow-soft">
          {feedback}
        </div>
      )}

      {actionError && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700 shadow-soft">
          {actionError}
        </div>
      )}
    </div>
  )
}

export default AdminPanel
