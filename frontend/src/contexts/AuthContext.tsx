import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AxiosError } from 'axios'
import { api, setAuthToken } from '../lib/api'
import {
  StoredOrganization,
  StoredUser,
  clearAuthSession,
  getAuthToken,
  getStoredOrganizationId,
  getStoredUser,
  persistAuthToken,
  persistAuthUser,
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
  organization: StoredOrganization | null
  organizationId: string | null
  organizations: StoredOrganization[]
  status: AuthStatus
  initializing: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<StoredUser | null>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>
  setOrganization: (organizationId: string | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const resolveOrganizationId = (user: StoredUser | null, preferred: string | null) => {
  const organizations = user?.organizations ?? []
  if (!organizations.length) return null

  if (preferred && organizations.some((org) => org.id === preferred)) {
    return preferred
  }

  const candidate =
    user?.default_organization_id ??
    user?.defaultOrganizationId ??
    organizations[0]?.id ??
    null

  if (candidate && organizations.some((org) => org.id === candidate)) {
    return candidate
  }

  return organizations[0]?.id ?? null
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
  const [organizationId, setOrganizationIdState] = useState<string | null>(() =>
    getStoredOrganizationId(),
  )
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [initializing, setInitializing] = useState(true)

  const handleUnauthorized = useCallback(() => {
    clearAuthSession()
    setAuthToken(null)
    setUser(null)
    setOrganizationIdState(null)
    setStatus('unauthenticated')
    setInitializing(false)
  }, [])

  const applyUserState = useCallback(
    (nextUser: StoredUser | null) => {
      setUser(nextUser)
      persistAuthUser(nextUser)
      const nextOrgId = resolveOrganizationId(nextUser, organizationId)
      setOrganizationIdState(nextOrgId)
      persistSelectedOrganizationId(nextOrgId)

      setStatus(nextUser ? 'authenticated' : 'unauthenticated')
      setInitializing(false)
      return nextUser
    },
    [organizationId],
  )

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
      return nextUser
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        handleUnauthorized()
      }
      throw error
    }
  }, [applyUserState, handleUnauthorized])

  const login = useCallback(
    async ({ email, password }: LoginPayload) => {
      try {
        const response = await api.post('/auth/login', { email, password })
        const token = response.data?.token as string | undefined
        const userPayload = (response.data?.user ?? null) as StoredUser | null

        if (!token) {
          throw new Error('Missing token in response payload.')
        }

        persistAuthToken(token)
        setAuthToken(token)
        applyUserState(userPayload)
      } catch (error) {
        throw error
      }
    },
    [applyUserState],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore logout api failures
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

  const setOrganization = useCallback((nextOrganizationId: string | null) => {
    setOrganizationIdState(nextOrganizationId)
    persistSelectedOrganizationId(nextOrganizationId)
  }, [])

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      handleUnauthorized()
      setInitializing(false)
      return
    }

    setAuthToken(token)

    refreshProfile()
      .catch(() => {
        handleUnauthorized()
      })
      .finally(() => {
        setInitializing(false)
      })
  }, [handleUnauthorized, refreshProfile])

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

  const organizations = user?.organizations ?? []
  const organization = useMemo(
    () => organizations.find((item) => item.id === organizationId) ?? null,
    [organizationId, organizations],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      organization,
      organizationId,
      organizations,
      status,
      initializing,
      isAuthenticated: status === 'authenticated',
      login,
      logout,
      refreshProfile,
      requestPasswordReset,
      resetPassword,
      setOrganization,
    }),
    [
      initializing,
      login,
      logout,
      organization,
      organizationId,
      organizations,
      refreshProfile,
      requestPasswordReset,
      resetPassword,
      setOrganization,
      status,
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
