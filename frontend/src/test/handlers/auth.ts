import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

const url = (path: string) => `${env.apiBaseUrl}${path}`

// 既定は「ログイン中」（refresh が 200）。未ログインや 401 を検証するテストは
// server.use(...) で上書きする。
export const authHandlers = [
  http.get(url('/csrf'), () => new HttpResponse(null, { status: 200 })),
  http.post(url('/refresh'), () => new HttpResponse(null, { status: 200 })),
  http.post(url('/login'), () => new HttpResponse(null, { status: 200 })),
  http.post(url('/register'), () => new HttpResponse(null, { status: 201 })),
  http.post(url('/logout'), () => new HttpResponse(null, { status: 200 })),
]
