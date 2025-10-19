const TOKEN_KEY = 'authToken'

export type AuthToken = string

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
