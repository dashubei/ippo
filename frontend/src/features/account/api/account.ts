import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { DeleteAccountInput } from '@/features/account/schemas'

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: async (input: DeleteAccountInput) => {
      await apiClient.post('/delete-account', input)
    },
  })
