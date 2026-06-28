// 曝露の「行動」を決めるための足場かけ用データ。抑制学習・接近（回避でなく）に整合させる。
// /learn（学ぶ）と曝露作成フォームの両方から使うため、feature をまたがず @/lib に置く。

// 「〜しないようにする」（回避）→「自分から〜する」（接近）への言い換え例。
export interface ApproachPair {
  avoid: string
  approach: string
}

export const approachPairs: ApproachPair[] = [
  { avoid: '話しかけられないようにする', approach: '自分から一つ質問してみる' },
  { avoid: '目を合わせないようにする', approach: '相手の目を見て話す' },
  {
    avoid: '意見を求められても黙る',
    approach: '求められなくても短い意見を一つ言う',
  },
  { avoid: '誘いを断ってやり過ごす', approach: '誘いに一度だけ乗ってみる' },
]

// 社交場面でよくある、具体的で取り組みやすい行動の例。
export const actionExamples: string[] = [
  '朝のあいさつを自分からする',
  '会議で一度だけ発言する',
  '店員さんに一つ質問する',
  '雑談に一言だけ加わる',
  'わからないことを質問する',
  'ありがとうを言葉で伝える',
]

// 行動を具体的にするための問い（誰と/どこで/どのくらい）。
export const specificityPrompts: string[] = [
  '誰に向けて？',
  'どこで・いつ？',
  'どのくらいの時間・回数？',
  '手放す「お守り」はある？',
]

// 練習のときに一つだけ手放してみる「お守り（安全行動）」の例。
export const safetyBehaviorExamples: string[] = [
  'スマホを見て間をもたせる',
  '誰かに付き添ってもらう',
  '事前にセリフを練習しすぎる',
  'お酒で緊張をやわらげる',
]
