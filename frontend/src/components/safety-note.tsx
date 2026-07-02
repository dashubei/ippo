const links = [
  {
    label: 'まもろうよこころ（厚生労働省）',
    href: 'https://www.mhlw.go.jp/mamorouyokokoro/',
  },
  { label: 'いのちの電話', href: 'https://www.inochinodenwa.org/' },
]

const legalLinks = [
  { label: '利用規約', href: '/terms' },
  { label: 'プライバシーポリシー', href: '/privacy' },
  { label: '免責事項', href: '/disclaimer' },
]

// 非医療の免責と、つらいときの相談先サインポスト。記録画面で不安を数値化するため
// アプリ内（ログイン後レイアウト）と公開LPの双方に常設する。
export const SafetyNote = () => (
  <div className="flex flex-col items-center gap-1.5 text-center text-xs leading-relaxed text-ink-soft">
    <p>
      ippo
      は医療・診断・治療を目的としたものではなく、セルフヘルプ／教育のためのツールです。
    </p>
    <p>
      つらさが強いとき・ひとりで抱えきれないと感じるときは、専門の窓口に頼ってください。
    </p>
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
      {links.map((link) => (
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
    <nav className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
      {legalLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-ink-soft/40 underline-offset-2 transition-colors hover:text-ink"
        >
          {link.label}
        </a>
      ))}
    </nav>
  </div>
)
