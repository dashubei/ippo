// ログイン不要の「お試し」。この端末（localStorage）に 1 件だけ保存する。
export interface QuickCheck {
  action: string
  anxiety: number
  savedAt: string
}

const KEY = 'ippo:quick-check'

export const loadQuickCheck = (): QuickCheck | null => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<QuickCheck>
    if (
      typeof parsed.action !== 'string' ||
      typeof parsed.anxiety !== 'number'
    ) {
      return null
    }
    return {
      action: parsed.action,
      anxiety: parsed.anxiety,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
    }
  } catch {
    return null
  }
}

export const saveQuickCheck = (input: {
  action: string
  anxiety: number
}): QuickCheck => {
  const record: QuickCheck = { ...input, savedAt: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(record))
  return record
}

export const clearQuickCheck = () => localStorage.removeItem(KEY)
