import { isAxiosError } from 'axios'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import type { ApiFieldErrors } from '@/types/api'

// DRF の 400 フィールドエラー（{ field: [msg] }）を react-hook-form の setError に反映する。
// 反映できたら true を返す（呼び出し側はフォーム全体エラーの出し分けに使う）。
export const applyApiFieldErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean => {
  if (!isAxiosError(error) || error.response?.status !== 400) return false

  const data = error.response.data as ApiFieldErrors | undefined
  if (!data || typeof data !== 'object') return false

  let applied = false
  for (const [field, messages] of Object.entries(data)) {
    if (Array.isArray(messages) && messages.length > 0) {
      setError(field as Path<T>, {
        type: 'server',
        message: String(messages[0]),
      })
      applied = true
    }
  }
  return applied
}
