# ippo 開発ガイド（人間向け）

最終更新: 2026-06-28

---

## プロジェクト概要

社交場面の不安を持つ人が、価値（ACT）に紐づけた曝露を記録するセルフヘルプ Web アプリ。

詳細: [要件定義](requirements.md)

---

## 構成

```
ippo/
├── backend/         # Django 6 + DRF（AWS EC2 + RDS MySQL）
├── frontend/        # React 19 + Vite + TypeScript（Vercel）
├── docs/
│   ├── backend/     # バックエンド設計（API・ER 図）
│   ├── frontend/    # フロントエンド設計（デザインガイド）
│   ├── requirements.md
│   └── tech-stack.md
├── CLAUDE.md        # AI（Claude Code）向け指示
└── pnpm-workspace.yaml
```

---

## バックエンドセットアップ

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

環境変数: `backend/.env`（`.gitignore` 済み）に `SECRET_KEY` / `DATABASE_URL` を設定。

---

## フロントエンドセットアップ

```bash
cd frontend
pnpm install
pnpm dev
```

環境変数: `frontend/.env.local` に `VITE_API_BASE_URL` を設定。

---

## 主要ドキュメント

| ドキュメント | 内容 |
|---|---|
| [要件定義](requirements.md) | MVP スコープ・機能要件 |
| [技術選定](tech-stack.md) | スタック選定の理由 |
| [API 設計](backend/api.md) | エンドポイント一覧 |
| [ER 図](backend/er.md) | データモデル |
| [デザインガイド](frontend/DESIGN.md) | UI/UX 設計方針 |
| [テスト方針](frontend/TESTING.md) | 結合テスト・E2E のテストケース |

---

## ブランチ戦略

- `main`: 本番相当。直接 push 禁止
- `feature/*`: 機能開発
- PR を通してのみ main にマージ

## コミットメッセージ

```
feat: 新機能
fix: バグ修正
chore: ビルド・設定変更
docs: ドキュメントのみ
refactor: 動作を変えないリファクタリング
test: テスト追加・修正
```
