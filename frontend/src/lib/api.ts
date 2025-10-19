import axios from 'axios'
import { queueRequest, flushQueue } from './offline'

export const api = axios.create({ baseURL: '/api' })

let currentToken: string | null = null
let currentOrganizationCode: string | null = null

export function setAuthToken(token: string | null) {
  currentToken = token
}

export function setOrganizationHeader(code: string | null) {
  currentOrganizationCode = code
}

api.interceptors.request.use((config) => {
  const headers = { ...config.headers }
  if (currentToken) {
    headers.Authorization = `Bearer ${currentToken}`
  }
  if (currentOrganizationCode) {
    headers['X-Org'] = currentOrganizationCode
  }
  return {
    ...config,
    headers,
  }
})

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (!navigator.onLine && err.config && !err.config.__queued) {
      await queueRequest(err.config)
      return Promise.resolve({
        data: { offlineQueued: true },
        status: 202,
        statusText: 'OFFLINE',
        headers: {},
        config: err.config,
      })
    }
    return Promise.reject(err)
  },
)

export async function syncAll() {
  await flushQueue(api)
}
