import { http, HttpResponse, type RequestHandler } from 'msw'
import { env } from '@/config/env'
import type { UserValue } from '@/types/api'

const url = (path: string) => `${env.apiBaseUrl}${path}`

const DUPLICATE_ERROR = { name: ['この価値はすでに登録されています'] }

let store: UserValue[] = []
let nextId = 1

// テスト間で状態が漏れないよう、テストの beforeEach 等から呼べるようにする。
export const resetValuesStore = (seed: UserValue[] = []) => {
  store = seed.map((value) => ({ ...value }))
  nextId = store.reduce((max, value) => Math.max(max, value.id), 0) + 1
}

interface ValueBody {
  name?: string
}

export const valuesHandlers: RequestHandler[] = [
  http.get(url('/values'), () => HttpResponse.json(store)),

  http.post(url('/values'), async ({ request }) => {
    const { name = '' } = (await request.json()) as ValueBody
    if (store.some((value) => value.name === name)) {
      return HttpResponse.json(DUPLICATE_ERROR, { status: 400 })
    }
    const created: UserValue = {
      id: nextId++,
      name,
      created_at: new Date().toISOString(),
    }
    store = [...store, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch(url('/values/:id'), async ({ request, params }) => {
    const id = Number(params.id)
    const { name = '' } = (await request.json()) as ValueBody
    if (store.some((value) => value.name === name && value.id !== id)) {
      return HttpResponse.json(DUPLICATE_ERROR, { status: 400 })
    }
    const target = store.find((value) => value.id === id)
    if (!target) return new HttpResponse(null, { status: 404 })
    const updated: UserValue = { ...target, name }
    store = store.map((value) => (value.id === id ? updated : value))
    return HttpResponse.json(updated)
  }),

  http.delete(url('/values/:id'), ({ params }) => {
    const id = Number(params.id)
    store = store.filter((value) => value.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]
