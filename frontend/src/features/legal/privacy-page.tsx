import { LegalPageLayout, LegalSection } from './legal-page-layout'

const collectedItems = [
  'メールアドレス（アカウント登録・本人認証のため）',
  'パスワード（ハッシュ化したうえで保存し、当社が平文を知ることはありません）',
  'お客様が登録した価値・曝露の記録（行動の内容、不安度などの数値、メモ等）',
  'アクセスログ（接続日時・IP アドレス・ブラウザの種類等）',
  '認証・セキュリティのための Cookie（ログイン状態の維持・CSRF 対策に使用）',
]

const purposes = [
  '本人認証およびログイン状態の維持',
  'お客様の記録を保存し、お客様ご自身に表示するため',
  '不正利用の防止およびセキュリティの確保',
  'お問い合わせへの対応',
]

export const PrivacyPage = () => (
  <LegalPageLayout
    documentTitle="プライバシーポリシー | ippo"
    heading="プライバシーポリシー"
    intro={
      <p className="text-sm leading-relaxed text-ink-soft">
        ippo（以下「本サービス」といいます）における、お客様の個人情報の取り扱いについて定めます。
      </p>
    }
  >
    <LegalSection title="1. 事業者情報">
      <p>本サービスの運営者および個人情報の取扱責任者は以下のとおりです。</p>
      <ul className="flex flex-col gap-1 text-ink-soft">
        <li>運営者: [運営者名]</li>
        <li>連絡先: [連絡先メールアドレス]</li>
        <li>所在地: [所在地]</li>
      </ul>
    </LegalSection>

    <LegalSection title="2. 取得する情報">
      <p>本サービスは、次の情報を取得します。</p>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-soft">
        {collectedItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </LegalSection>

    <LegalSection title="3. 利用目的">
      <p>取得した情報は、次の目的の範囲内で利用します。</p>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-soft">
        {purposes.map((purpose) => (
          <li key={purpose}>{purpose}</li>
        ))}
      </ul>
    </LegalSection>

    <LegalSection title="4. 第三者提供">
      <p>
        本サービスは、法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
      </p>
    </LegalSection>

    <LegalSection title="5. 安全管理措置">
      <p>本サービスは、個人情報の保護のため次の措置を講じます。</p>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-soft">
        <li>通信は HTTPS による暗号化を行います。</li>
        <li>パスワードはハッシュ化して保存します。</li>
        <li>取得した情報へのアクセスを必要な範囲に制限します。</li>
      </ul>
    </LegalSection>

    <LegalSection title="6. 保存期間と退会時の削除">
      <p>
        お客様の情報は、本サービスの利用期間中、利用目的の達成に必要な範囲で保存します。お客様が退会された場合、登録情報および記録は、法令で保存が義務付けられている場合を除き削除します。
      </p>
    </LegalSection>

    <LegalSection title="7. 開示・訂正・利用停止等の請求">
      <p>
        お客様は、ご自身の個人情報について、開示・訂正・利用停止・削除を請求できます。ご請求は
        [連絡先メールアドレス]
        までご連絡ください。ご本人であることを確認のうえ、対応いたします。
      </p>
    </LegalSection>

    <LegalSection title="8. Cookie の利用">
      <p>
        本サービスは、ログイン状態の維持および CSRF
        対策を目的として、本サービス自身が発行する Cookie（First-Party
        Cookie）のみを使用します。広告や外部サービスによるアクセス解析タグは利用しません。
      </p>
    </LegalSection>

    <LegalSection title="9. 本ポリシーの改定">
      <p>
        本サービスは、必要に応じて本ポリシーを改定することがあります。改定後の内容は本ページに掲載した時点から適用されます。
      </p>
    </LegalSection>
  </LegalPageLayout>
)
