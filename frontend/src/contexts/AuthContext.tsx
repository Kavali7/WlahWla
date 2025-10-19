import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AxiosError } from 'axios'
import { api, setAuthToken, setOrganizationHeader } from '../lib/api'
import {
  StoredOrganization,
  StoredUser,
  clearAuthSession,
  getAuthToken,
  getStoredOrganizationCode,
  getStoredOrganizationId,
  getStoredUser,
  persistAuthToken,
  persistAuthUser,
  persistSelectedOrganizationCode,
  persistSelectedOrganizationId,
} from '../lib/auth'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type LoginPayload = {
  email: string
  password: string
}

type ResetPasswordPayload = {
  token: string
  password: string
  passwordConfirmation?: string
}

type AuthContextValue = {
  user: StoredUser | null
  organizations: StoredOrganization[]
  organization: StoredOrganization | null
  organizationId: string | null
  organizationsLoading: boolean
  organizationError: string | null
  organizationChecklist: string[]
  requiresOrganizationSetup: boolean
  status: AuthStatus
  initializing: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<StoredUser | null>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>
  setOrganization: (organizationId: string | null) => void
  refreshOrganizations: () => Promise<StoredOrganization[]>
  updateOrganizationProfile: (data: Partial<StoredOrganization>) => Promise<StoredOrganization>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const normalizeOrganization = (organization: any): StoredOrganization => {
  const idCandidate = organization?.id ?? organization?.uuid ?? organization?.code
  return {
    ...organization,
    id: idCandidate ? String(idCandidate) : '',
    code: organization?.code ?? organization?.org_code ?? undefined,
    name: organization?.name,
    address:
      organization?.address ??
      organization?.address_line ??
      organization?.address_line1 ??
      organization?.address1 ??
      organization?.registered_address ??
      null,
    tax_id: organization?.tax_id ?? organization?.taxNumber ?? organization?.taxId ?? null,
    trade_register:
      organization?.trade_register ?? organization?.tradeRegister ?? organization?.trade_register_number ?? null,
    is_onboarded: organization?.is_onboarded ?? organization?.isOnboarded ?? undefined,
    missing_fields: organization?.missing_fields ?? organization?.missingFields ?? undefined,
  }
}

const ensureString = (value: unknown): string | null => {
  if (value === undefined || value === null) return null
  const text = String(value)
  return text.length ? text : null
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
  const [organizations, setOrganizations] = useState<StoredOrganization[]>(() => getStoredUser()?.organizations ?? [])
  const [organizationId, setOrganizationIdState] = useState<string | null>(() => getStoredOrganizationId())
  const [organizationCode, setOrganizationCodeState] = useState<string | null>(() => getStoredOrganizationCode())
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [initializing, setInitializing] = useState(true)
  const [organizationsLoading, setOrganizationsLoading] = useState(false)
  const [organizationError, setOrganizationError] = useState<string | null>(null)

  const determinePreferredOrganization = useCallback(
    (list: StoredOrganization[]): StoredOrganization | null => {
      const storedId = getStoredOrganizationId()
      if (storedId) {
        const match = list.find((org) => ensureString(org.id) === storedId)
        if (match) return match
      }
      const storedCode = getStoredOrganizationCode()
      if (storedCode) {
        const match = list.find((org) => org.code === storedCode)
        if (match) return match
      }
      if (organizationId) {
        const match = list.find((org) => ensureString(org.id) === organizationId)
        if (match) return match
      }
      return list[0] ?? null
    },
    [organizationId],
  )

  const applyOrganizationSelection = useCallback((organization: StoredOrganization | null) => {
    const nextId = ensureString(organization?.id)
    const nextCode = ensureString(organization?.code) ?? nextId
    setOrganizationIdState(nextId)
    persistSelectedOrganizationId(nextId)
    setOrganizationCodeState(nextCode)
    persistSelectedOrganizationCode(nextCode)
    setOrganizationHeader(nextCode)
  }, [])

  useEffect(() => {
    setOrganizationHeader(organizationCode)
  }, [organizationCode])

  const handleUnauthorized = useCallback(() => {
    clearAuthSession()
    setAuthToken(null)
    setOrganizationHeader(null)
    setUser(null)
    setOrganizations([])
    applyOrganizationSelection(null)
    setStatus('unauthenticated')
    setInitializing(false)
  }, [applyOrganizationSelection])

  const applyUserState = useCallback(
    (nextUser: StoredUser | null) => {
      let processedUser = nextUser

      if (nextUser?.organizations?.length) {
        const normalized = nextUser.organizations.map(normalizeOrganization)
        setOrganizations(normalized)
        const preferred = determinePreferredOrganization(normalized)
        applyOrganizationSelection(preferred)
        processedUser = { ...nextUser, organizations: normalized }
      } else if (!nextUser) {
        setOrganizations([])
        applyOrganizationSelection(null)
      }

      setUser(processedUser)
      persistAuthUser(processedUser)
      setStatus(processedUser ? 'authenticated' : 'unauthenticated')
      setInitializing(false)
      return processedUser
    },
    [applyOrganizationSelection, determinePreferredOrganization],
  )

  const loadOrganizations = useCallback(async () => {
    setOrganizationsLoading(true)
    setOrganizationError(null)
    try {
      const response = await api.get('/organizations/')
      const payload = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.results)
        ? response.data.results
        : []
      const normalized = (payload as any[]).map(normalizeOrganization)
      setOrganizations(normalized)
      setUser((prev) => {
        if (!prev) return prev
        const nextUser = { ...prev, organizations: normalized }
        persistAuthUser(nextUser)
        return nextUser
      })
      const preferred = determinePreferredOrganization(normalized)
      applyOrganizationSelection(preferred)
      setOrganizationError(null)
      return normalized
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 404) {
        setOrganizations([])
        applyOrganizationSelection(null)
        setOrganizationError("Aucune organisation n'est encore disponible pour votre compte.")
        return []
      }
      if (axiosError.response?.status === 401) {
        handleUnauthorized()
        return []
      }
      const message =
        axiosError.response?.status !== undefined
          ? `Erreur ${axiosError.response.status} lors du chargement des organisations.`
          : "Impossible de contacter le serveur. Vérifiez votre connexion."
      setOrganizationError(message)
      if (!organizations.length) {
        setOrganizations([])
        applyOrganizationSelection(null)
      }
      throw error
    } finally {
      setOrganizationsLoading(false)
    }
  }, [
    applyOrganizationSelection,
    determinePreferredOrganization,
    handleUnauthorized,
    organizations.length,
  ])

  const refreshProfile = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return null
    }

    try {
      setStatus('loading')
      setAuthToken(token)
      const response = await api.get('/auth/me')
      const nextUser = (response.data ?? null) as StoredUser | null
      applyUserState(nextUser)
      try {
        await loadOrganizations()
      } catch {
        // handled by loadOrganizations state
      }
      return nextUser
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        handleUnauthorized()
      }
      throw error
    }
  }, [applyUserState, handleUnauthorized, loadOrganizations])

  const login = useCallback(
    async ({ email, password }: LoginPayload) => {
      try {
        setStatus('loading')
        const response = await api.post('/auth/login', { email, password })
        const token = response.data?.token as string | undefined
        const userPayload = (response.data?.user ?? null) as StoredUser | null

        if (!token) {
          throw new Error('Missing token in response payload.')
        }

        persistAuthToken(token)
        setAuthToken(token)
        applyUserState(userPayload)
        try {
          await loadOrganizations()
        } catch {
          // handled by loadOrganizations state
        }
      } catch (error) {
        throw error
      }
    },
    [applyUserState, loadOrganizations],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // best effort
    } finally {
      handleUnauthorized()
    }
  }, [handleUnauthorized])

  const requestPasswordReset = useCallback(async (email: string) => {
    await api.post('/auth/password/forgot', { email })
  }, [])

  const resetPassword = useCallback(
    async ({ token, password, passwordConfirmation }: ResetPasswordPayload) => {
      await api.post('/auth/password/reset', {
        token,
        password,
        password_confirmation: passwordConfirmation ?? password,
      })
    },
    [],
  )

  const setOrganization = useCallback(
    (nextOrganizationId: string | null) => {
      if (!nextOrganizationId) {
        applyOrganizationSelection(null)
        return
      }
      const match =
        organizations.find((org) => ensureString(org.id) === ensureString(nextOrganizationId)) ?? null
      applyOrganizationSelection(match)
    },
    [applyOrganizationSelection, organizations],
  )

  const updateOrganizationProfile = useCallback(
    async (data: Partial<StoredOrganization>) => {
      const currentOrganization = organizations.find((org) => ensureString(org.id) === organizationId)
      if (!currentOrganization) {
        throw new Error('No organization selected.')
      }
      const response = await api.patch(`/organizations/${currentOrganization.id}/`, data)
      const updated = normalizeOrganization(response.data)

      setOrganizations((prev) =>
        prev.map((org) => (ensureString(org.id) === ensureString(updated.id) ? { ...org, ...updated } : org)),
      )

      setUser((prev) =>
        prev
          ? {
              ...prev,
              organizations: prev.organizations?.map((org) =>
                ensureString(org.id) === ensureString(updated.id) ? { ...org, ...updated } : org,
              ),
            }
          : prev,
      )

      if (ensureString(currentOrganization.id) === ensureString(updated.id)) {
        applyOrganizationSelection({ ...currentOrganization, ...updated })
      }

      return updated
    },
    [applyOrganizationSelection, organizationId, organizations],
  )

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          handleUnauthorized()
        }
        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [handleUnauthorized])

  useEffect(() => {
    refreshProfile().catch(() => {
      // errors handled in refreshProfile
    })
  }, [refreshProfile])

  const organization = useMemo(
    () => organizations.find((item) => ensureString(item.id) === organizationId) ?? null,
    [organizationId, organizations],
  )

  const organizationChecklist = useMemo(() => {
    if (!organization) return []
    if (Array.isArray(organization.missing_fields) && organization.missing_fields.length) {
      return organization.missing_fields
    }
    const missing: string[] = []
    if (!organization.address) missing.push('address')
    if (!organization.tax_id) missing.push('tax_id')
    if (!organization.trade_register) missing.push('trade_register')
    if (organization.is_onboarded === false && missing.length === 0) {
      missing.push('organization_profile')
    }
    return missing
  }, [organization])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      organizations,
      organization,
      organizationId,
      organizationsLoading,
      organizationError,
      organizationChecklist,
      requiresOrganizationSetup: organizationChecklist.length > 0,
      status,
      initializing,
      isAuthenticated: status === 'authenticated',
      login,
      logout,
      refreshProfile,
      requestPasswordReset,
      resetPassword,
      setOrganization,
      refreshOrganizations: loadOrganizations,
      updateOrganizationProfile,
    }),
    [
      initializing,
      loadOrganizations,
      login,
      logout,
      organization,
      organizationChecklist,
      organizationId,
      organizations,
      organizationError,
      organizationsLoading,
      refreshProfile,
      requestPasswordReset,
      resetPassword,
      setOrganization,
      status,
      updateOrganizationProfile,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
