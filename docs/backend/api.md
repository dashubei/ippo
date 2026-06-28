# ippo API 設計（MVP）

最終更新: 2026-06-28
方針: REST。リソースは名詞・複数形。動作は HTTP メソッドで表す。全エンドポイントに `/api/` 接頭辞。

---

## 共通事項
- **認証（実装済み・httpOnly Cookie 方式）**：register／login／refresh が access/refresh を `Set-Cookie`（httpOnly）で発行する。クライアントは Cookie を自動送信（`credentials: "include"`）し、`Authorization` ヘッダは使わない。サーバは `CookieJWTAuthentication`（Cookie の access を読む認証クラス）で本人を判定する。
- **CSRF**：Cookie 方式のため変更系（POST/PATCH/DELETE）は `X-CSRFToken` ヘッダ必須（double-submit cookie）。`GET /api/csrf` で `csrftoken` Cookie を取得し、その値をヘッダに載せる。安全メソッド（GET 等）は対象外。
- **データ分離**：一覧・取得は URL に `user_id` を含めず、**トークンの本人**で絞り込む。他人のデータは返さない。
- **ステータス**：作成 `201` ／ 取得・更新 `200` ／ 削除 `204` ／ 入力不正 `400` ／ 未認証 `401` ／ 権限なし `403` ／ 不存在 `404`。
- **試用**：ゲストログイン機能は設けず、**練習用アカウント**を事前作成し、その資格情報を README に記載して試用してもらう。

## 認証
| メソッド | パス | 役割 | 認証 | リクエスト | 成功 |
|---|---|---|---|---|---|
| POST | `/api/register` | 登録 | 不要 | body `{email, password, name}` | 201（access/refresh を Cookie 発行） |
| POST | `/api/login` | ログイン | 不要 | body `{email, password}` | 200（access/refresh を Cookie 発行） |
| POST | `/api/refresh` | access 更新 | Cookie の refresh | —（Cookie のみ） | 200（access/refresh を Cookie 再発行） |
| POST | `/api/logout` | ログアウト（refresh 失効） | 不要※ | —（Cookie のみ） | 200（refresh を blacklist＋Cookie 削除） |
| GET | `/api/csrf` | csrftoken Cookie 発行 | 不要 | — | 200（`csrftoken` Cookie をセット） |

※ logout（`LogoutView`）は access が失効していてもログアウトできるよう authentication/permission を外し、Cookie の refresh を blacklist 化＋Cookie を削除する。

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
| POST /api/register | ✅ Cookie 発行（`RegisterView`） |
| POST /api/login | ✅ Cookie 発行（`CookieTokenObtainPairView`） |
| POST /api/refresh | ✅ Cookie 方式（`CookieTokenRefreshView`） |
| POST /api/logout | ✅ Cookie 削除＋blacklist（`LogoutView`） |
| GET /api/csrf | ✅ csrftoken 発行（`CSRFView` + `ensure_csrf_cookie`） |
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
- **認証は httpOnly Cookie 方式**：トークンを JS から不可視にし XSS 窃取を防ぐ。引き換えに CSRF 対策（`csrftoken` Cookie と `X-CSRFToken` ヘッダの double-submit）を `CookieJWTAuthentication` 内で**変更系のみ**実施。Cookie 属性は `settings.AUTH_COOKIE` に集約し、`set_auth_cookie` ヘルパーで発行を共通化。
- **register の `name`**：現状 `User.name` に `blank=True` が無いため DRF 上は**必須**。任意にするにはモデルに `blank=True` を追加する（残タスク）。
