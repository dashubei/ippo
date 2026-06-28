import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ExposureRecord } from '@/types/api'
import type {
  CompleteExposureInput,
  CreateExposureInput,
} from '@/features/exposures/schemas'

const exposuresQueryKey = ['exposures'] as const

interface ExposuresParams {
  /** done_at の範囲フィルタ（ISO 日時文字列）。任意 */
  from?: string
  to?: string
}

export const useExposures = (params?: ExposuresParams) =>
  useQuery({
    queryKey: [...exposuresQueryKey, params ?? null] as const,
    queryFn: async () => {
      const { data } = await apiClient.get<ExposureRecord[]>('/exposures', {
        params,
      })
      return data
    },
  })

export const useExposure = (id: number) =>
  useQuery({
    queryKey: [...exposuresQueryKey, id] as const,
    queryFn: async () => {
      const { data } = await apiClient.get<ExposureRecord>(`/exposures/${id}`)
      return data
    },
  })

export const useCreateExposure = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateExposureInput) => {
      const { data } = await apiClient.post<ExposureRecord>('/exposures', input)
      return data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: exposuresQueryKey }),
  })
}

export const useUpdateExposure = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: CompleteExposureInput & { id: number }) => {
      const { data } = await apiClient.patch<ExposureRecord>(
        `/exposures/${id}`,
        input,
      )
      return data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: exposuresQueryKey }),
  })
}

export const useDeleteExposure = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/exposures/${id}`)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: exposuresQueryKey }),
  })
}
