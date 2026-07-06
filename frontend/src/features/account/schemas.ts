import { z } from 'zod'

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
})
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
