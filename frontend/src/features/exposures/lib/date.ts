import type { ExposureRecord } from '@/types/api'

// ローカルタイムゾーンでの YYYY-MM-DD キー。カレンダーの日付グルーピングに使う。
export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const groupByDoneDate = (
  records: ExposureRecord[],
): Map<string, ExposureRecord[]> => {
  const groups = new Map<string, ExposureRecord[]>()
  for (const record of records) {
    if (!record.done_at) continue
    const key = toDateKey(new Date(record.done_at))
    const bucket = groups.get(key)
    if (bucket) {
      bucket.push(record)
      continue
    }
    groups.set(key, [record])
  }
  return groups
}

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDateTime = (iso: string): string =>
  dateTimeFormatter.format(new Date(iso))

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const formatDate = (date: Date): string => dateFormatter.format(date)

// datetime-local の値（"YYYY-MM-DDTHH:mm"、ローカル）を ISO 文字列に変換する。
// 不正な値（ブラウザ差・空文字）では null を返し、呼び出し側でエラー表示する。
export const localInputToIso = (value: string): string | null => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

// 現在時刻を datetime-local 入力値（"YYYY-MM-DDTHH:mm"、ローカル）で返す。
// 「やった直後に記録する」動線が大半なので、実施日時の初期値に使い入力の手間を省く。
export const nowLocalInput = (): string => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}
