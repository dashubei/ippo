import { Link } from 'react-router-dom'
import { LegalPageLayout, type LegalSectionData } from './legal-page-layout'

const prohibitedItems = [
  '法令または公序良俗に違反する行為',
  '本サービスの運営を妨げる行為、または不正にアクセスする行為',
  '他のお客様または第三者の権利を侵害する行為',
  '他人のアカウントを不正に利用する行為',
  '本サービスを通じて取得した情報を、運営者の許可なく転用・再配布する行為',
]

const sections: LegalSectionData[] = [
  {
    id: 'scope',
    title: '適用範囲・定義',
    body: (
      <>
        <p>
          本規約は、本サービスの提供条件および運営者とお客様との間の権利義務関係を定めるものであり、お客様と本サービスとの間の本サービスの利用に関わる一切の関係に適用されます。
        </p>
        <p>
          本規約において「お客様」とは、本規約に同意のうえ本サービスを利用するすべての方をいいます。
        </p>
      </>
    ),
  },
  {
    id: 'account',
    title: 'アカウント',
    body: (
      <p>
        お客様は、メールアドレスおよびパスワードを登録することでアカウントを作成できます。お客様は、ご自身のアカウント情報を適切に管理する責任を負うものとし、第三者に利用させ、または貸与・譲渡してはなりません。
      </p>
    ),
  },
  {
    id: 'non-medical',
    title: '本サービスの位置づけ（非医療）',
    body: (
      <>
        <p>
          本サービスは、非医療のセルフヘルプ／教育を目的としたツールです。本サービスは、医療行為・診断・治療・カウンセリングを提供するものではなく、これらの代替となるものではありません。
        </p>
        <p>
          体調や症状に不安がある場合、または症状が悪化した場合は、医療機関または専門家にご相談ください。詳しくは
          <Link to="/disclaimer" className="font-bold text-accent underline">
            免責事項・相談窓口
          </Link>
          をご確認ください。
        </p>
      </>
    ),
  },
  {
    id: 'prohibited',
    title: '禁止事項',
    body: (
      <>
        <p>お客様は、本サービスの利用にあたり、次の行為をしてはなりません。</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-soft">
          {prohibitedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    title: '知的財産',
    body: (
      <p>
        本サービスに関する著作権・商標権その他の知的財産権は、運営者または正当な権利者に帰属します。お客様がご自身で登録した記録の内容は、お客様に帰属します。
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'サービスの変更・中断・終了',
    body: (
      <p>
        運営者は、お客様への事前の通知なく、本サービスの内容を変更し、または提供を中断・終了することがあります。本サービスは現状有姿で提供され、その完全性・正確性・有用性等について保証するものではありません。
      </p>
    ),
  },
  {
    id: 'liability',
    title: '免責',
    body: (
      <p>
        運営者は、本サービスの利用によってお客様に生じた損害について、運営者の故意または重大な過失による場合を除き、責任を負わないものとします。
      </p>
    ),
  },
  {
    id: 'data',
    title: 'データの取り扱い',
    body: (
      <p>
        お客様の個人情報および記録の取り扱いについては、
        <Link to="/privacy" className="font-bold text-accent underline">
          プライバシーポリシー
        </Link>
        の定めによります。
      </p>
    ),
  },
  {
    id: 'withdrawal',
    title: '退会・アカウント削除',
    body: (
      <p>
        お客様は、いつでも退会し、アカウントを削除することができます。退会後の情報の取り扱いについては、プライバシーポリシーの定めによります。
      </p>
    ),
  },
  {
    id: 'law',
    title: '準拠法・合意管轄',
    body: (
      <p>
        本規約の準拠法は日本法とします。本サービスに関して運営者とお客様との間に生じた紛争については、[管轄裁判所]
        を第一審の専属的合意管轄裁判所とします。
      </p>
    ),
  },
  {
    id: 'revision',
    title: '本規約の変更',
    body: (
      <p>
        運営者は、必要に応じて本規約を変更することがあります。変更後の規約は、本ページに掲載した時点から適用されます。
      </p>
    ),
  },
]

export const TermsPage = () => (
  <LegalPageLayout
    documentTitle="利用規約 | ippo"
    heading="利用規約"
    intro={
      <p className="text-sm leading-relaxed text-ink-soft">
        本利用規約（以下「本規約」といいます）は、ippo（以下「本サービス」といいます）の利用条件を定めるものです。
      </p>
    }
    sections={sections}
  />
)
