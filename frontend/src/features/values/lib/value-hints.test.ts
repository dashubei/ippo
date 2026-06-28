import { describe, expect, test } from 'vitest'
import { detectValueHint } from '@/features/values/lib/value-hints'

describe('detectValueHint', () => {
  test('空文字は null', () => {
    expect(detectValueHint('')).toBeNull()
    expect(detectValueHint('   ')).toBeNull()
  })

  test('健全な価値はヒントなし', () => {
    expect(detectValueHint('誠実でいる')).toBeNull()
    expect(detectValueHint('人とのつながりを大切にする')).toBeNull()
  })

  test('不安の低減はやさしく問い返す', () => {
    expect(detectValueHint('不安をなくす')).toContain('どんな自分でいたいか')
    expect(detectValueHint('緊張しないようになりたい')).not.toBeNull()
  })

  test('ゴール表現は目標かもと知らせる', () => {
    expect(detectValueHint('英語を話せるようになる')).toContain('目標')
    expect(detectValueHint('資格に合格する')).toContain('目標')
  })

  test('他者評価（pliance）は関わり方の深掘りを促す', () => {
    expect(detectValueHint('人に好かれるようになる')).toContain('関わり方')
    expect(detectValueHint('嫌われないようにする')).not.toBeNull()
  })
})
