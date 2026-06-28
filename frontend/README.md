# ippo フロントエンド

社交場面の不安に、価値（ACT）に紐づけた小さな一歩（曝露）を記録・振り返るセルフヘルプ Web アプリのフロントエンド。React 19 + Vite + TypeScript + Tailwind CSS の SPA。

## セットアップ

```bash
pnpm install
```

環境変数は `.env.local` に置く（`.env*` はコミットしない）。

```bash
# バックエンド API のベース URL（末尾に /api を含める。末尾スラッシュなし）
VITE_API_BASE_URL=http://localhost:8000/api
```

未設定時は `http://localhost:8000/api` を既定値として使う。

```bash
pnpm dev      # 開発サーバー（http://localhost:5173）
```

> バックエンドの CORS / CSRF 許可は `localhost:5173` 固定のため、開発サーバーはこのポートで起動する（`server.strictPort: true`）。

## スクリプト

| コマンド            | 内容                               |
| ------------------- | ---------------------------------- |
| `pnpm dev`          | Vite 開発サーバー                  |
| `pnpm build`        | 型チェック（`tsc -b`）＋本番ビルド |
| `pnpm preview`      | ビルド成果物のプレビュー           |
| `pnpm typecheck`    | 型チェックのみ                     |
| `pnpm test`         | vitest（watch）                    |
| `pnpm test:run`     | vitest（1 回実行・CI 用）          |
| `pnpm test:e2e`     | Playwright（E2E）                  |
| `pnpm lint`         | oxlint                             |
| `pnpm format`       | oxfmt（整形）                      |
| `pnpm format:check` | oxfmt（差分チェックのみ）          |

`lefthook` の pre-commit で `lint` と `format:check`、pre-push で `test:run` が走る（リポジトリルートの `lefthook.yml`）。フックの有効化は `pnpm exec lefthook install`。

## 構成（bullet-proof-react 準拠）

```
src/
├── app/         # ルーター・レイアウト・ガード
├── components/  # 共通 UI（ui/・seo/）
├── config/      # 環境変数
├── features/    # 機能単位（auth / values / exposures / marketing）
│   └── <feature>/{api,components,lib}
├── lib/         # axios・QueryClient・共通ユーティリティ
├── stores/      # 認証 Context
├── test/        # MSW・テストユーティリティ
└── types/       # 共通型
```

- ファイル名は **kebab-case**（oxlint の `unicorn/filename-case` で強制）。コンポーネントの export 名は PascalCase。
- feature をまたぐ import は禁止。共有は `components/` `lib/` `stores/` `types/` 経由。
- import は `@/` エイリアス（`@/features/...`）で統一。
- React Compiler 有効のため `useMemo` / `useCallback` の手書きはしない。

## 認証（httpOnly Cookie 方式）

- axios は `withCredentials: true`。アクセストークン/リフレッシュトークンは httpOnly Cookie のため JS からは読めない。
- 変更系（POST/PATCH/DELETE）には `csrftoken` Cookie の値を `X-CSRFToken` ヘッダで送る（`GET /api/csrf` で取得）。
- 401 を受けたら axios interceptor が `POST /api/refresh` を 1 回試行し、失敗したら認証状態をクリアしてログインへ。
- 起動時の本人確認は `localStorage` の email フラグがある場合のみ `POST /api/refresh` を probe する（未ログイン端末への 401 ノイズ回避）。バックエンドに軽量な `GET /api/me` が用意されればそちらが望ましい。

## テスト

- 結合テスト: vitest + React Testing Library + MSW（`src/test/`）。API はモックし、バックエンドは起動しない。
- E2E: Playwright（`e2e/`）。**実バックエンド（またはシードした test DB）が必要**。ブラウザは `pnpm exec playwright install` で取得する。

## デプロイ（Vercel）

- `vercel.json` に SPA リライトとセキュリティヘッダ（HSTS / CSP など）を設定済み。
- **デプロイ前に置換が必要なプレースホルダ**:
  - `vercel.json` の CSP `connect-src` の `https://REPLACE_WITH_API_ORIGIN` を本番バックエンド API のオリジンに。
  - `public/robots.txt` / `public/sitemap.xml` / `index.html` の `og:url` の `REPLACE_WITH_SITE_ORIGIN` を本番フロントエンドのオリジンに。
- CSP は `script-src 'self'`（インラインスクリプト不使用）。`style-src` はインラインスタイル・Google Fonts のため `'unsafe-inline'` を許可している。

## SEO

- 公開トップ（`/`）の OG / Twitter カード / JSON-LD は `index.html` に静的記載（OG スクレイパは JS を実行しないため）。記録系ページ（`/values`・`/exposures`）は `noindex`。
- 本格的なビルド時プリレンダ（SSG）は、React Router v7 の framework mode（`ssr: false` + `prerender: ['/']`）への移行で実現できる。現状は library mode のため、静的メタで対応し SSG 移行はフォローアップとする。

## 練習用アカウント

ゲストログインは設けない。バックエンドで事前作成した練習用アカウントの資格情報を以下に記載する（デプロイ時に記入）。

```
メールアドレス: （記入）
パスワード: （記入）
```
