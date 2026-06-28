import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { emitUnauthorized } from '@/lib/auth-events'
import { getCookie } from '@/lib/csrf'
import { env } from '@/config/env'

const SAFE_METHODS = new Set(['get', 'head', 'options'])
const AUTH_PATHS = ['/login', '/register', '/refresh', '/logout']

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
})

// 変更系（POST/PATCH/DELETE）に CSRF トークンを付与（double-submit cookie）。
apiClient.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toLowerCase()
  if (!SAFE_METHODS.has(method)) {
    const token = getCookie('csrftoken')
    if (token) config.headers.set('X-CSRFToken', token)
  }
  return config
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// 同時多発の 401 で refresh が重複しないよう single-flight にする。
let refreshPromise: Promise<unknown> | null = null

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = apiClient.post('/refresh').finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

const isAuthPath = (url?: string) => {
  if (!url) return false
  const path = url.split('?')[0]
  return AUTH_PATHS.some((authPath) => path.endsWith(authPath))
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const status = error.response?.status

    if (status === 401 && config && !config._retry && !isAuthPath(config.url)) {
      config._retry = true
      try {
        await refreshSession()
        return await apiClient(config)
      } catch {
        emitUnauthorized()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
