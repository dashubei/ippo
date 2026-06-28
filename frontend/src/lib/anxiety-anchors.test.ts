import { beforeEach, describe, expect, test } from 'vitest'
import { clearAnchors, loadAnchors, saveAnchors } from '@/lib/anxiety-anchors'

describe('anxiety-anchors', () => {
  beforeEach(() => localStorage.clear())

  test('未設定なら null を返す', () => {
    expect(loadAnchors()).toBeNull()
  })

  test('保存した値を読み戻せる（前後の空白は除去）', () => {
    saveAnchors({
      low: ' 朝の挨拶 ',
      mid: '会議で発言',
      high: '大勢の前で失敗',
    })
    const loaded = loadAnchors()
    expect(loaded?.low).toBe('朝の挨拶')
    expect(loaded?.mid).toBe('会議で発言')
    expect(loaded?.high).toBe('大勢の前で失敗')
    expect(loaded?.savedAt).not.toBe('')
  })

  test('壊れた JSON は null を返す', () => {
    localStorage.setItem('ippo:anxiety-anchors', '{ broken')
    expect(loadAnchors()).toBeNull()
  })

  test('必須フィールドが欠けていれば null を返す', () => {
    localStorage.setItem('ippo:anxiety-anchors', JSON.stringify({ low: 'a' }))
    expect(loadAnchors()).toBeNull()
  })

  test('clearAnchors で消える', () => {
    saveAnchors({ low: 'a', mid: 'b', high: 'c' })
    clearAnchors()
    expect(loadAnchors()).toBeNull()
  })
})
