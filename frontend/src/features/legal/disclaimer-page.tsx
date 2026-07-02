import { PhoneCall } from 'lucide-react'
import { LegalPageLayout, type LegalSectionData } from './legal-page-layout'

interface Hotline {
  name: string
  detail: string
  tel?: string
}

const hotlines: Hotline[] = [
  {
    name: 'こころの健康相談統一ダイヤル',
    detail: '0570-064-556',
    tel: '0570064556',
  },
  {
    name: 'よりそいホットライン',
    detail: '0120-279-338（24時間・通話無料）',
    tel: '0120279338',
  },
  {
    name: 'いのちの電話（ナビダイヤル）',
    detail: '0570-783-556',
    tel: '0570783556',
  },
]

const sections: LegalSectionData[] = [
  {
    id: 'about',
    title: '本サービスについて',
    body: (
      <>
        <p>
          ippo（以下「本サービス」といいます）は、非医療のセルフヘルプ／教育を目的としたツールです。医療行為・診断・治療・カウンセリングではありません。
        </p>
        <p>
          本サービスは診断や治療の代替となるものではなく、取り組みの効果には個人差があります。気になる症状があるとき、または症状が悪化したときは、無理をせず医療機関や専門家にご相談ください。
        </p>
      </>
    ),
  },
  {
    id: 'hotlines',
    title: 'つらい気持ちのとき・緊急のとき',
    highlight: true,
    body: (
      <>
        <p>
          ひとりで抱えきれないと感じたときは、どうか我慢せず、次の窓口に話してみてください。あなたのことを大切に思っている人や仕組みがあります。
        </p>

        <ul className="flex flex-col gap-2">
          {hotlines.map((line) => (
            <li
              key={line.name}
              className="flex items-start gap-3 rounded-xl bg-white/70 p-3"
            >
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent"
                aria-hidden="true"
              >
                <PhoneCall size={18} />
              </span>
              <div className="leading-relaxed">
                <p className="font-bold text-ink">{line.name}</p>
                {line.tel ? (
                  <a
                    href={`tel:${line.tel}`}
                    className="font-bold text-accent underline"
                  >
                    {line.detail}
                  </a>
                ) : (
                  <p className="text-ink-soft">{line.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p>
          相談先に迷うときは、厚生労働省の
          <a
            href="https://www.mhlw.go.jp/mamorouyokokoro/"
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold text-accent underline"
          >
            「まもろうよ こころ」
          </a>
          にもさまざまな窓口がまとまっています。
        </p>

        <p className="rounded-xl bg-white/70 p-3 font-bold text-ink">
          命の危険が差し迫っていると感じるときは、ためらわず
          119（救急）・110（警察）に連絡してください。
        </p>
      </>
    ),
  },
  {
    id: 'accuracy',
    title: '情報の正確性と責任',
    body: (
      <p>
        本サービスは、提供する情報の正確性・完全性・有用性について保証するものではありません。運営者は、本サービスの利用によってお客様に生じた結果について、運営者の故意または重大な過失による場合を除き、責任を負いません。
      </p>
    ),
  },
  {
    id: 'external-links',
    title: '外部リンクについて',
    body: (
      <p>
        本サービスは、外部のウェブサイトへのリンクを掲載することがあります。リンク先のサイトはそれぞれの運営者が管理しており、その内容について運営者は責任を負いません。
      </p>
    ),
  },
]

export const DisclaimerPage = () => (
  <LegalPageLayout
    documentTitle="免責事項・相談窓口 | ippo"
    heading="免責事項・相談窓口"
    intro={
      <p className="text-sm leading-relaxed text-ink-soft">
        本サービスを安心して使っていただくための大切なお知らせです。
      </p>
    }
    sections={sections}
  />
)
