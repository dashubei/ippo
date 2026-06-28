import { z } from 'zod'

export const createExposureSchema = z.object({
  value: z.coerce.number().int().positive('価値を選択してください'),
  action: z
    .string()
    .min(1, '行動を入力してください')
    .max(150, '行動は150文字以内で入力してください'),
  anxiety_before: z.coerce
    .number()
    .int()
    .min(0, '不安度は0〜100で入力してください')
    .max(100, '不安度は0〜100で入力してください'),
  memo_before: z
    .string()
    .max(2000, 'メモは2000文字以内で入力してください')
    .optional(),
})
export type CreateExposureForm = z.input<typeof createExposureSchema>
export type CreateExposureInput = z.output<typeof createExposureSchema>

export const completeExposureSchema = z.object({
  done_at: z.string().min(1, '実施日時を入力してください'),
  anxiety_after: z.coerce
    .number()
    .int()
    .min(0, '不安度は0〜100で入力してください')
    .max(100, '不安度は0〜100で入力してください'),
  memo_after: z
    .string()
    .max(2000, 'メモは2000文字以内で入力してください')
    .optional(),
})
export type CompleteExposureForm = z.input<typeof completeExposureSchema>
export type CompleteExposureInput = z.output<typeof completeExposureSchema>
