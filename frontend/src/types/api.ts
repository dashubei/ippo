// バックエンド（DRF）のレスポンス型。docs/backend/er.md・api.md と一致させる。

export interface UserValue {
  id: number
  name: string
  created_at: string
}

export interface ExposureRecord {
  id: number
  user: number
  /** 紐づく UserValue の id */
  value: number
  action: string
  anxiety_before: number
  anxiety_after: number | null
  memo_before: string | null
  memo_after: string | null
  /** 実施日時。null = 未実施 */
  done_at: string | null
  created_at: string
}

/** DRF のフィールドバリデーションエラー（{ field: [messages] }） */
export type ApiFieldErrors = Record<string, string[]>
