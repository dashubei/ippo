# ippo 技術選定（MVP）

最終更新: 2026-06-24
方針: 「一番すごいもの」ではなく「**この課題・この構成・この制約に一番フィットするもの**」を、理由つきで選ぶ。

---

## スタック一覧
| レイヤー | 採用 | 主な理由 |
|---|---|---|
| バックエンド | **Python + Django + Django REST Framework (DRF)** | ORM・認証・マイグレーション・セキュリティ既定が揃う「全部入り」。DB を伴う Web アプリを規約に沿って速く・安全に作れる |
| データベース | **MySQL** | 広く使われ実績のあるリレーショナル DB。マネージド運用と相性が良い |
| フロントエンド | **React + Vite + TypeScript**（+ Tailwind CSS） | API が別に立つ SPA 構成では SSR 不要。構成が単純で前後の責務が明確、開発も速い |
| 認証 | **JWT（`djangorestframework-simplejwt`）** | ステートレスで SPA/モバイルに向く。access(短命)＋refresh で有効期限を管理 |
| インフラ | **AWS（EC2 + RDS）/ Linux** | 実務標準のクラウド。スケール・マネージドサービス・環境構築の自由度。OS は Linux |
| Web サーバ | **Nginx + Gunicorn** | Nginx が受け口（リバースプロキシ/静的配信）、Gunicorn が Django を動かす定番構成 |
| フロント配信 | **Vercel**（無料） | React の配信に最適・CDN・自動デプロイ |

## 「なぜ対抗馬でなくこれか」
- **Django+DRF vs FastAPI/Node**：FastAPI は高速だが部品を自前で組む量が多い。Node は同言語だが同様。DB 付き Web アプリを「全部入り＋規約」で安全に速く作るなら Django。
- **MySQL vs PostgreSQL**：ほぼ互角。チームの慣れ・ホスティング事情で決まる領域。本プロジェクトは MySQL を採用。
- **Vite+React(SPA) vs Next.js**：Next は SSR/SEO/フルスタック一体に強いが、API を別に持つ本構成では使わない複雑さを抱える。SPA の方が責務が明確。
- **JWT vs セッション/Token**：別オリジン SPA でセッションは CORS/CSRF が面倒。DRF Token は失効は楽だが無期限 1 本で粗い。JWT は弱点（後述）を対処すれば SPA に好適。
- **AWS vs VPS/レンタルサーバー**：共用レンタルサーバーは独自環境を入れにくく、カスタム Django に不向き。VPS でも可だが、AWS はマネージド(RDS)・スケール・実務標準の利点。

## インフラ構成（MVP）
```
[ユーザー] --HTTPS--> [Vercel: React(SPA)]
                          |  API 呼び出し(JWT)
                          v
            [AWS EC2 (Linux) : Nginx + Gunicorn + Django/DRF]
                          |
                          v
                  [AWS RDS : MySQL]
```
- フロント（Vercel）とバック（EC2）は別オリジンなので、**CORS** を `django-cors-headers` で許可する。

## 認証方針（JWT）
- `djangorestframework-simplejwt` を使用。**access token（短命・例15分）＋ refresh token（長命・例数日〜2週間）**。
- access が切れても refresh で自動更新し、使用中に理不尽に切れないようにする。ログアウト時は refresh を無効化して失効させる。
- 保存：refresh はより安全な場所（httpOnly Cookie 等）に置く方針（実装時に確定）。
- JWT の弱点「即時失効が弱い」への対処として、access を短命にし、失効は refresh 側で管理する。

## セキュリティ方針
- パスワードはハッシュ保存（Django 標準）。通信は HTTPS（Let's Encrypt）。秘密情報は環境変数。
- 主要脆弱性対策：SQLi（ORM）／XSS（React・DRF）／CSRF（認証方式に応じて）／**ブルートフォース（DRF throttling）**。
- AWS は最小権限の IAM・セキュリティグループでポートを絞る・RDS は非公開サブネット。

## コスト前提
- 新規 AWS アカウントのクレジット（6 か月）内での運用を想定し、**Budgets アラートを設定**、利用後は **teardown**。
- 常時公開のフロントは無料（Vercel）。

## 開発方針（重要）
- **バックエンドの核（モデル・認可・データ分離・主要ビュー）は AI に書かせず、自分で 1 行ずつ書いて説明できる状態にする。**
- AI（Claude Code 等）は設計レビュー・ドキュメント整備・定型コードの補助に活用し、その活用は透明に記録する。
- AI 出力は読んで検証してからマージする。
