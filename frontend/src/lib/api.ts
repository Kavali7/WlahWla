import axios from 'axios'
import { queueRequest, flushQueue } from './offline'

export const api = axios.create({ baseURL: '/api' })

let currentToken: string | null = null

export function setAuthToken(token: string | null) {
  currentToken = token
}

api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${currentToken}`,
    }
  }
  return config
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
