# ippo API 設計（MVP）

最終更新: 2026-06-24
方針: REST。リソースは名詞・複数形。動作は HTTP メソッドで表す。全エンドポイントに `/api/` 接頭辞。

---

## 共通事項
- **認証**：登録／ログインで**トークン**を受け取り、以降のリクエストはヘッダにトークンを付与する。
- **データ分離**：一覧・取得は URL に `user_id` を含めず、**トークンの本人**で絞り込む。他人のデータは返さない。
- **ステータス**：作成 `201` ／ 取得・更新 `200` ／ 削除 `204` ／ 入力不正 `400` ／ 未認証 `401` ／ 権限なし `403` ／ 不存在 `404`。
- **試用**：ゲストログイン機能は設けず、**練習用アカウント**を事前作成し、その資格情報を README に記載して試用してもらう。

## 認証
| メソッド | パス | 役割 | 認証 | リクエスト | 成功 |
|---|---|---|---|---|---|
| POST | `/api/register` | 登録 | 不要 | body `{email, password, name?(任意)}` | 201（トークン返却） |
| POST | `/api/login` | ログイン | 不要 | body `{email, password}` | 200（トークン返却） |
| POST | `/api/logout` | ログアウト | 要 | — | 204 |

## 価値（UserValue）
| メソッド | パス | 役割 | 認証 | リクエスト | 成功 |
|---|---|---|---|---|---|
| GET | `/api/values` | 一覧（本人のみ） | 要 | — | 200 |
| POST | `/api/values` | 作成 | 要 | body `{name}` | 201 |
| PATCH | `/api/values/{id}` | 更新 | 要 | body `{name}` | 200 |
| DELETE | `/api/values/{id}` | 削除 | 要 | — | 204 |

## 曝露記録（ExposureRecord）
| メソッド | パス | 役割 | 認証 | リクエスト | 成功 |
|---|---|---|---|---|---|
| GET | `/api/exposures` | 一覧／カレンダー（本人のみ） | 要 | query `{from?, to?}`（日付範囲） | 200 |
| POST | `/api/exposures` | 作成 | 要 | body `{value, action, anxiety_before, memo_before?}` | 201 |
| GET | `/api/exposures/{id}` | 1 件取得（任意） | 要 | — | 200 |
| PATCH | `/api/exposures/{id}` | 実施後の追記 | 要 | body `{done_at, anxiety_after, memo_after}` | 200 |
| DELETE | `/api/exposures/{id}` | 削除 | 要 | — | 204 |

## 実装状況（2026-06-28 時点）
| エンドポイント | 状態 |
|---|---|
| POST /api/register | ✅ 実装済み・動作確認済み |
| POST /api/login | ✅ 実装済み・動作確認済み |
| POST /api/logout | ✅ 実装済み・動作確認済み |
| GET /api/values | ✅ 実装済み・動作確認済み |
| POST /api/values | ✅ 実装済み・動作確認済み |
| PATCH /api/values/{id} | ✅ 実装済み |
| DELETE /api/values/{id} | ✅ 実装済み |
| GET /api/exposures | ✅ 実装済み・動作確認済み（日付フィルター対応） |
| POST /api/exposures | ✅ 実装済み・動作確認済み |
| GET /api/exposures/{id} | ✅ 実装済み |
| PATCH /api/exposures/{id} | ✅ 実装済み |
| DELETE /api/exposures/{id} | ✅ 実装済み |

## 設計上の判断メモ
- **カレンダー(F6)は専用エンドポイントを作らず**、一覧 `GET /api/exposures` に日付範囲クエリ（`from`/`to`）を付けて実現する。
- **実施後の追記**は新規作成ではなく既存 1 件の部分更新なので `PATCH /api/exposures/{id}`。`done_at` が入った時点で「実施済み」とみなす。
- 状態を変えない取得は `GET`、状態を変える操作は `POST`/`PATCH`/`DELETE` に割り当てる（`GET` は安全・body を持たない）。
