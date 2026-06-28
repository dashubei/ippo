// 認証必須の記録系ページはクロールさせない（プライバシー）。React 19 が head へ巻き上げる。
export const NoIndex = () => <meta name="robots" content="noindex, nofollow" />
