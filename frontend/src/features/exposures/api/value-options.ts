import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { UserValue } from '@/types/api'

// 作成フォームの value セレクト用。価値 feature の hook は import せず、
// 同じ queryKey ['values'] で軽量取得する（キャッシュは共有される）。
export const useValueOptions = () =>
  useQuery({
    queryKey: ['values'] as const,
    queryFn: async () => {
      const { data } = await apiClient.get<UserValue[]>('/values')
      return data
    },
  })
