import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { UserValue } from '@/types/api'
import type { ValueInput } from '@/features/values/schemas'

const valuesQueryKey = ['values'] as const

export const useValues = () =>
  useQuery({
    queryKey: valuesQueryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<UserValue[]>('/values')
      return data
    },
  })

// オンボーディング完了時などは一覧を未マウントのまま遷移するため、refetchType:'all' で
// 非アクティブなクエリも再取得し、遷移先が古いキャッシュを描画しないようにする。
const invalidateValues = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({
    queryKey: valuesQueryKey,
    refetchType: 'all',
  })

export const useCreateValue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ValueInput) => {
      const { data } = await apiClient.post<UserValue>('/values', input)
      return data
    },
    onSuccess: () => invalidateValues(queryClient),
  })
}

export const useUpdateValue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: ValueInput & { id: number }) => {
      const { data } = await apiClient.patch<UserValue>(`/values/${id}`, input)
      return data
    },
    onSuccess: () => invalidateValues(queryClient),
  })
}

export const useDeleteValue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/values/${id}`)
    },
    onSuccess: () => invalidateValues(queryClient),
  })
}
