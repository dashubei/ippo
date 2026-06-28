import { z } from 'zod'

export const valueSchema = z.object({
  name: z
    .string()
    .min(1, '大切にしたいことを入力してください')
    .max(200, '価値は200文字以内で入力してください'),
})
export type ValueInput = z.infer<typeof valueSchema>
