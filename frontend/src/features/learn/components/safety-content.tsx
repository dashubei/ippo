import { LifeBuoy } from 'lucide-react'

const supportLinks = [
  {
    label: 'まもろうよこころ（厚生労働省）',
    href: 'https://www.mhlw.go.jp/mamorouyokokoro/',
  },
  { label: 'いのちの電話', href: 'https://www.inochinodenwa.org/' },
]

// 「安全に使うために」の中身。ハブ（/learn）とモーダルの両方から呼ぶため、
// 表示のみの純コンポーネントとして切り出す。相談先を先に出し、
// 判断のための一覧は後に置く（まず頼れる先を示してから、必要性を伝える順）。
export const SafetyContent = () => (
  <div className="flex flex-col gap-3">
    <p className="text-sm leading-relaxed text-ink">
      ippo
      は医療・診断・治療のためのものではなく、セルフヘルプ／教育のツールです。つらさが強いときは、ひとりで抱えずに頼ってください。
    </p>
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {supportLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="font-bold text-accent underline"
        >
          {link.label}
        </a>
      ))}
    </div>
    <div className="rounded-2xl bg-white/60 p-4">
      <div className="flex items-center gap-2">
        <LifeBuoy size={18} aria-hidden="true" className="text-ink-soft" />
        <p className="text-sm font-bold text-ink">
          次のようなときは、自分だけで取り組まず専門の窓口や支援者に相談してください
        </p>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-ink-soft">
        <li>・強い希死念慮や、自分を傷つけたい気持ちがあるとき</li>
        <li>
          ・抑えられないパニックや、強い動悸・息苦しさが繰り返し起きるとき
        </li>
        <li>・現実感のなさや、つらい記憶のフラッシュバックがあるとき</li>
        <li>
          ・お酒や薬に頼る気持ちが強くなっている、または量が増えているとき
        </li>
      </ul>
    </div>
    <p className="text-sm leading-relaxed text-ink-soft">
      取り組んで調子が悪くなったときも、いったん中断して専門家に相談してください。
    </p>
  </div>
)
