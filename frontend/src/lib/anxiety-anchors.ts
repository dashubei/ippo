// 不安スライダー（0-100）の「自分の目盛り」。0/50/100 を本人の過去の具体的な体験に
// 結びつけて保存する（個人アンカー）。これにより点数が個人内で一貫し、縦断的に比較できる。
// バックエンドは 0-100 の数値のみ扱うため、アンカー文はこの端末（localStorage）にだけ持つ。
export interface AnxietyAnchors {
  /** 0 付近 = まったく平気だった出来事 */
  low: string
  /** 50 付近 = 落ち着かないが、なんとかその場にいられた出来事 */
  mid: string
  /** 100 = これまでで一番きつかった出来事 */
  high: string
  savedAt: string
}

const KEY = 'ippo:anxiety-anchors'

export const loadAnchors = (): AnxietyAnchors | null => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AnxietyAnchors>
    if (
      typeof parsed.low !== 'string' ||
      typeof parsed.mid !== 'string' ||
      typeof parsed.high !== 'string'
    ) {
      return null
    }
    return {
      low: parsed.low,
      mid: parsed.mid,
      high: parsed.high,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
    }
  } catch {
    return null
  }
}

export const saveAnchors = (input: {
  low: string
  mid: string
  high: string
}): AnxietyAnchors => {
  const record: AnxietyAnchors = {
    low: input.low.trim(),
    mid: input.mid.trim(),
    high: input.high.trim(),
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(KEY, JSON.stringify(record))
  return record
}

export const clearAnchors = () => localStorage.removeItem(KEY)
