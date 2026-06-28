import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/lib/auth-events'
import { apiClient } from '@/lib/axios'

type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated'

interface RegisterInput {
  email: string
  password: string
  name: string
}

interface AuthContextValue {
  status: AuthStatus
  email: string | null
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

const EMAIL_KEY = 'ippo:email'
const AuthContext = createContext<AuthContextValue | null>(null)

// GET /api/csrf で csrftoken Cookie を取得（変更系リクエストの X-CSRFToken に使う）。
const ensureCsrf = () => apiClient.get('/csrf').catch(() => undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('pending')
  const [email, setEmail] = useState<string | null>(() =>
    localStorage.getItem(EMAIL_KEY),
  )

  // 起動時に refresh で本人確認（200=ログイン中 / 401=未ログイン）。バックエンドに /me が無いため refresh を probe に使う。
  useEffect(() => {
    let active = true
    const bootstrap = async () => {
      // 一度もログインしていない（email 記録なし）端末では refresh probe を打たない。
      // 未ログイン訪問者への 401 ノイズと、リロード毎の refresh トークン回転を避ける。
      if (!localStorage.getItem(EMAIL_KEY)) {
        setStatus('unauthenticated')
        return
      }
      await ensureCsrf()
      try {
        await apiClient.post('/refresh')
        if (active) setStatus('authenticated')
      } catch {
        if (!active) return
        localStorage.removeItem(EMAIL_KEY)
        setEmail(null)
        setStatus('unauthenticated')
      }
    }
    void bootstrap()
    return () => {
      active = false
    }
  }, [])

  // axios の 401→refresh 失敗時にセッションをクリアする。
  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(EMAIL_KEY)
      setEmail(null)
      setStatus('unauthenticated')
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const persistSession = (value: string) => {
    localStorage.setItem(EMAIL_KEY, value)
    setEmail(value)
    setStatus('authenticated')
  }

  const login = async (emailInput: string, password: string) => {
    await apiClient.post('/login', { email: emailInput, password })
    await ensureCsrf()
    persistSession(emailInput)
  }

  const register = async ({
    email: emailInput,
    password,
    name,
  }: RegisterInput) => {
    await apiClient.post('/register', { email: emailInput, password, name })
    await ensureCsrf()
    persistSession(emailInput)
  }

  const logout = async () => {
    try {
      await apiClient.post('/logout')
    } catch {
      // refresh が失効済みでもクライアント状態はクリアする
    }
    localStorage.removeItem(EMAIL_KEY)
    setEmail(null)
    setStatus('unauthenticated')
  }

  const value: AuthContextValue = { status, email, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth は AuthProvider の内側で使う')
  return ctx
}
