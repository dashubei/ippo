import { useState } from 'react'
import {
  clearAnchors,
  loadAnchors,
  saveAnchors,
  type AnxietyAnchors,
} from '@/lib/anxiety-anchors'

export const useAnxietyAnchors = () => {
  const [anchors, setAnchors] = useState<AnxietyAnchors | null>(() =>
    loadAnchors(),
  )

  const save = (input: { low: string; mid: string; high: string }) =>
    setAnchors(saveAnchors(input))

  const clear = () => {
    clearAnchors()
    setAnchors(null)
  }

  return { anchors, saveAnchors: save, clearAnchors: clear }
}
