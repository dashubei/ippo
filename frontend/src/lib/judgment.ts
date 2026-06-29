// 曝露（チャレンジ）の「不安の強さ」から、挑戦の難易度の目安を返す。
//
// 根拠（曝露療法の難易度に関する知見・あくまで目安で医療助言ではない）:
// - 馴化モデル: 中程度の難易度（SUDS 50〜60 あたり）から段階的に。
// - 抑制学習モデル(Craske 他): 易しすぎると学習が乏しく、難しすぎると回避・離脱を招く。
//   「挑戦的だが対処可能」な強さが望ましく、不安を下げること自体は目標にしない。
// → 41〜70 を「ちょうどよい目安」とし、低すぎ/高すぎはやさしく知らせる。
// 参考: Craske et al. (inhibitory learning), Psychology Tools "effective exposure therapy"。

export type AnxietyLevel =
  | 'unnecessary'
  | 'low'
  | 'optimal'
  | 'caution'
  | 'hard'

export interface AnxietyJudgment {
  level: AnxietyLevel
  label: string
  emoji: string
  /** 絵文字の背景ハロー・カード枠の色 */
  accent: string
  /** クリーム背景でも読めるラベル文字色 */
  text: string
  /** カード背景の薄い色 */
  tint: string
  message: string
  recommendation: string
}

export const getAnxietyJudgment = (anxietyLevel: number): AnxietyJudgment => {
  if (anxietyLevel <= 20) {
    return {
      level: 'unnecessary',
      label: 'いまは挑戦しなくても大丈夫',
      emoji: '😌',
      accent: '#8fb8c9',
      text: '#356273',
      tint: '#eaf3f6',
      message: 'いまはほとんど不安がないようですね。',
      recommendation:
        'もう慣れていることかもしれません。もう少しだけドキドキする行動を選ぶと、練習になりやすいですよ。',
    }
  }
  if (anxietyLevel <= 40) {
    return {
      level: 'low',
      label: 'もう少し踏み込めそう',
      emoji: '🙂',
      accent: '#e0c07a',
      text: '#6f5618',
      tint: '#f8f1e0',
      message: '少しだけ不安がありますね。',
      recommendation:
        '取り組みやすそうですね。慣れてきたら、もう一歩だけ踏み込める行動も探してみましょう。',
    }
  }
  if (anxietyLevel <= 70) {
    return {
      level: 'optimal',
      label: 'ちょうどよい挑戦の目安',
      emoji: '😊',
      accent: '#8dbe9a',
      text: '#316a43',
      tint: '#e8f4ec',
      message: '向き合う練習にちょうどよい強さです。',
      recommendation:
        '不安を下げることを目標にする必要ありません。あなたの大切にしたいことに向かって取り組めたこと自体が、すでに一歩です。',
    }
  }
  if (anxietyLevel <= 85) {
    return {
      level: 'caution',
      label: '少し負荷が高めかも',
      emoji: '😟',
      accent: '#eca878',
      text: '#8f5526',
      tint: '#fbefe4',
      message: 'かなり不安が強いようですね。',
      recommendation:
        '取り組んでも大丈夫ですが、もう少し小さな一歩に分けると、続けやすくなるかもしれません。',
    }
  }
  return {
    level: 'hard',
    label: 'ひとつ小さくしてみよう',
    emoji: '😣',
    accent: '#e08c86',
    text: '#984139',
    tint: '#fae8e6',
    message: '不安がとても強い状態のようですね。',
    recommendation:
      'どうか無理はなさらないでください。もう少し取り組みやすい行動から、少しずつ始めてみましょう。',
  }
}
