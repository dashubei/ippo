import type { ReactNode } from 'react'

// /learn（使い方・考え方）のステップ式モーダルで使う共通の型。
// コンテンツ（lib/learn-content.tsx）と表示（components/topic-step-modal.tsx）で共有する。

export interface LearnStep {
  // 意味を担うイラスト。装飾目的なら alt は省略（Illustration 側で aria-hidden 扱い）。
  illustration?: { src: string; alt?: string }
  headline: string
  // 本文。強調や軽いグロスを含められるよう ReactNode。
  body: ReactNode
  // 補助枠。Disclosure・アコーディオン・スライダー等を差し込む。
  extra?: ReactNode
}

export interface LearnTopic {
  id: 'values' | 'action' | 'score'
  title: string
  // 所要時間の目安（分）。ハブのカードに「約◯分」で表示する。
  estMinutes: number
  steps: LearnStep[]
  // 最終ステップの主 CTA（唯一のボタン）。
  finalCta: { label: string; to: string }
}
