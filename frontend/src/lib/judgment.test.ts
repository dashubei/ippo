import { describe, expect, test } from 'vitest'
import { getAnxietyJudgment } from '@/lib/judgment'

describe('getAnxietyJudgment', () => {
  test('境界値ごとに正しいゾーンを返す', () => {
    expect(getAnxietyJudgment(0).level).toBe('unnecessary')
    expect(getAnxietyJudgment(20).level).toBe('unnecessary')
    expect(getAnxietyJudgment(21).level).toBe('low')
    expect(getAnxietyJudgment(40).level).toBe('low')
    expect(getAnxietyJudgment(41).level).toBe('optimal')
    expect(getAnxietyJudgment(70).level).toBe('optimal')
    expect(getAnxietyJudgment(71).level).toBe('caution')
    expect(getAnxietyJudgment(85).level).toBe('caution')
    expect(getAnxietyJudgment(86).level).toBe('hard')
    expect(getAnxietyJudgment(100).level).toBe('hard')
  })

  test('中程度（50〜60）が最適ゾーンになる（馴化モデルの目安）', () => {
    expect(getAnxietyJudgment(50).level).toBe('optimal')
    expect(getAnxietyJudgment(60).level).toBe('optimal')
  })
})
