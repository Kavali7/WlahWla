import axios from 'axios'
import { queueRequest, flushQueue } from './offline'

export const api = axios.create({ baseURL: '/api' })

api.interceptors.response.use(r => r, async err => {
  if (!navigator.onLine && err.config && !err.config.__queued) {
    await queueRequest(err.config)
    return Promise.resolve({ data: { offlineQueued: true }, status: 202, statusText: 'OFFLINE', headers: {}, config: err.config })
  }
  return Promise.reject(err)
})

export async function syncAll() { await flushQueue(api) }
