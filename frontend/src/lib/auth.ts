const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'
const ORG_KEY = 'authOrganizationId'

export type AuthToken = string

export type StoredOrganization = {
  id: string
  name?: string
}

export type StoredUser = {
  id: string
  email: string
  name?: string
  organizations?: StoredOrganization[]
  default_organization_id?: string
  defaultOrganizationId?: string
} & Record<string, unknown>

export function getAuthToken(): AuthToken | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function persistAuthToken(token: AuthToken) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore storage errors in graceful mode
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore storage errors in graceful mode
  }
}

export function persistAuthUser(user: StoredUser | null) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch {
    // ignore storage errors in graceful mode
  }
}

export function getStoredUser(): StoredUser | null {
  try {
    const value = localStorage.getItem(USER_KEY)
    if (!value) return null
    return JSON.parse(value) as StoredUser
  } catch {
    return null
  }
}

export function persistSelectedOrganizationId(organizationId: string | null) {
  try {
    if (organizationId) {
      localStorage.setItem(ORG_KEY, organizationId)
    } else {
      localStorage.removeItem(ORG_KEY)
    }
  } catch {
    // ignore storage errors in graceful mode
  }
}

export function getStoredOrganizationId(): string | null {
  try {
    return localStorage.getItem(ORG_KEY)
  } catch {
    return null
  }
}

export function clearAuthSession() {
  clearAuthToken()
  persistAuthUser(null)
  persistSelectedOrganizationId(null)
}
