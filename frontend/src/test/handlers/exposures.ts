import { http, HttpResponse, type RequestHandler } from 'msw'
import { env } from '@/config/env'
import type { ExposureRecord } from '@/types/api'

const url = (path: string) => `${env.apiBaseUrl}${path}`

let store: ExposureRecord[] = []
let nextId = 1

// テスト間で状態が漏れないよう、beforeEach 等から呼べるようにする。
export const resetExposuresStore = (seed: ExposureRecord[] = []) => {
  store = seed.map((record) => ({ ...record }))
  nextId = store.reduce((max, record) => Math.max(max, record.id), 0) + 1
}

interface CreateBody {
  value?: number
  action?: string
  anxiety_before?: number
  memo_before?: string
}

interface UpdateBody {
  done_at?: string
  anxiety_after?: number
  memo_after?: string
}

export const exposuresHandlers: RequestHandler[] = [
  http.get(url('/exposures'), ({ request }) => {
    const params = new URL(request.url).searchParams
    const from = params.get('from')
    const to = params.get('to')
    const filtered = store.filter((record) => {
      if (!record.done_at) return !from && !to ? true : false
      if (from && record.done_at < from) return false
      if (to && record.done_at > to) return false
      return true
    })
    // from/to 未指定なら全件返す（done_at=null も含む）。
    return HttpResponse.json(from || to ? filtered : store)
  }),

  http.post(url('/exposures'), async ({ request }) => {
    const body = (await request.json()) as CreateBody
    if (typeof body.value !== 'number') {
      return HttpResponse.json(
        { value: ['自分の価値のみ指定できます'] },
        { status: 400 },
      )
    }
    const created: ExposureRecord = {
      id: nextId++,
      user: 1,
      value: body.value,
      action: body.action ?? '',
      anxiety_before: body.anxiety_before ?? 0,
      anxiety_after: null,
      memo_before: body.memo_before ?? null,
      memo_after: null,
      done_at: null,
      created_at: new Date().toISOString(),
    }
    store = [...store, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.get(url('/exposures/:id'), ({ params }) => {
    const id = Number(params.id)
    const record = store.find((item) => item.id === id)
    if (!record) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(record)
  }),

  http.patch(url('/exposures/:id'), async ({ request, params }) => {
    const id = Number(params.id)
    const target = store.find((item) => item.id === id)
    if (!target) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as UpdateBody
    const updated: ExposureRecord = {
      ...target,
      done_at: body.done_at ?? target.done_at,
      anxiety_after: body.anxiety_after ?? target.anxiety_after,
      memo_after: body.memo_after ?? target.memo_after,
    }
    store = store.map((item) => (item.id === id ? updated : item))
    return HttpResponse.json(updated)
  }),

  http.delete(url('/exposures/:id'), ({ params }) => {
    const id = Number(params.id)
    store = store.filter((item) => item.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]
