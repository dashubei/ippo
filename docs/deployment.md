# ippo デプロイ手順書（AWS EC2 + RDS / Vercel）

最終確認日: **2026-07-01** / **実施完了: 2026-07-02**（本手順で本番デプロイ達成）
対象: バックエンド = AWS EC2(Ubuntu 24.04 LTS) + Nginx + Gunicorn + RDS MySQL / フロント = Vercel

> **実施時の変更点（2026-07-02）**: EC2 への接続は SSH ではなく **SSM Session Manager** を採用（22 番を開けない・鍵レス・操作は CloudTrail に記録）。フロントは当初 `*.vercel.app`（別オリジン）で試したが、認証 POST の CSRF が通らず、最終的に**フロントも独自ドメインのサブドメインに載せて same-site 化**して解決（詳細は §13 実施メモ）。

> **この手順書の位置づけ**
> ポートフォリオ用に「なぜこの構成か」「各コンポーネントが何をするか」「詰まったらどこを見るか」を厚めに解説する。丸暗記ではなく、面接や実務で構成を自分の言葉で説明できることを目的とする。
>
> **時点情報の注意**: AWS の無料利用枠・コンソール UI・Ubuntu のバージョン・certbot の導入方法は変化が速い。本書の該当箇所には「⚠️ 要再確認」を付けている。実施時は公式ドキュメントで最新を確認すること。
>
> **秘匿情報**: このファイルは GitHub 公開する。実際の IP・ドメイン・RDS エンドポイント・パスワード・AWS アカウント ID は**絶対に書かない**。実値は `docs/private/`（gitignore 済み）にメモする。本書ではすべて `<プレースホルダ>` 表記。

---

## 0. 全体像

### 構成図

```
[ユーザー] --HTTPS--> [Vercel: React(SPA)]  app.<domain>
                          |  fetch(credentials: include) で API 呼び出し（別オリジン）
                          v
              --HTTPS--> [EC2(Ubuntu) : Nginx]  api.<domain>
                          |  Nginx が 443 で終端し、静的は自分で返す／API は Gunicorn へ
                          v
                         [Gunicorn (UNIX socket)] --WSGI--> [Django/DRF]
                          |
                          v
                         [RDS : MySQL]（private subnet・EC2 からのみ到達可）
```

### リクエストの流れ（なぜ 3 段か）

- **Nginx**: インターネットの受け口（443 で TLS 終端）。静的ファイルは自分で高速配信し、動的リクエストだけ後段へ渡すリバースプロキシ。Gunicorn を直接インターネットに晒さないための盾でもある。
- **Gunicorn**: Python の WSGI サーバ。Django アプリ本体を実際に動かすプロセス。WSGI アプリは静的ファイルを配れないので、そこは Nginx に任せる。
- **Django/DRF**: アプリロジック。
- **RDS**: マネージド MySQL。バックアップ・パッチを AWS に任せられる。private subnet に置き、EC2 のセキュリティグループからのみ 3306 を許可する（インターネットから直接触れない）。

### この構成における認証 Cookie の要点（最重要）

ippo は httpOnly Cookie 認証。フロント(Vercel) とバック(EC2) が**別オリジン**（`app.<domain>` と `api.<domain>`、または `*.vercel.app` と `api.<domain>`）なので、クロスサイトで Cookie を送るには **`SameSite=None; Secure`** が必要。

- `SameSite=None` = クロスサイトのリクエストでも Cookie を送る許可。
- `Secure` = **HTTPS でしか Cookie を送らない**という制約。→ **フロントもバックも HTTPS 必須**。Vercel は自動で HTTPS。**EC2 側も HTTPS 化が必須**になる（後述 §8）。
- Let's Encrypt は **IP アドレスには証明書を発行しない**。よって EC2 にも FQDN（`api.<domain>`）が必要。独自ドメインを取れない場合は `sslip.io` / `nip.io`（IP 埋め込み DNS）で暫定 FQDN を作り証明書を取る手もある（⚠️ ポートフォリオとしては独自ドメイン推奨）。

> **⚠️ 最重要の落とし穴（2026-07-02 実施で判明）: CSRF は「same-site」でないと通らない**
> フロント(`*.vercel.app`)とバック(`api.<domain>`)が**別ドメイン（cross-site）**だと、`SameSite=None; Secure` で Cookie 自体は送れるが、**フロントの JS が `document.cookie` で別ドメインの `csrftoken` を読めない** → `X-CSRFToken` ヘッダを載せられず、認証済み POST/PATCH/DELETE が **403**（ログイン・未認証エンドポイントは通るので気づきにくい）。加えて cross-site Cookie は**サードパーティ Cookie 扱い**で Safari ITP / Chrome の廃止方針により将来壊れる。
> **解決**: フロントも**同じ親ドメインのサブドメイン**（例 `app.<domain>`）に載せ、Django で **`CSRF_COOKIE_DOMAIN = ".<domain>"`（本番のみ）** を設定して same-site 化する。これで `csrftoken` が両サブドメインで読め、Cookie がファーストパーティ化する。フロントを `*.vercel.app` のまま運用するなら CSRF トークンを**レスポンス body で返す**方式に切り替える必要がある（サードパーティ Cookie 問題は別途残る）。

---

## 1. 事前準備（AWS アカウント・コスト事故防止）

1. **AWS アカウント**を用意。
2. **⚠️ 無料利用枠（2025-07-15 に改定・要再確認）**
   - 2025-07-15 以降に作った新規アカウント: t3/t4g.micro などを **6 か月間、または無料クレジットを使い切るまで**利用可。
   - それ以前のアカウント: サインアップから **12 か月**、db.t3/t4g.micro を 750 時間/月・ストレージ 20GB など。
   - 注意: RDS の T 系は **Unlimited モード**で動くため、24 時間平均 CPU がベースラインを超えると課金される。放置で db.t4g.micro を 24/7 稼働すると無料枠外で月 $11.5 前後。
3. **Budgets アラート**を最初に設定（例: 月 $1 で通知）。コスト事故の保険。
4. **IAM**: ルートユーザーは MFA を付けて封印し、日常作業は管理者ロール/ユーザーで行う。デプロイ用は最小権限。
5. **リージョン固定**: EC2 と RDS は**同一リージョン・同一 VPC**に置く（別だと繋がらない）。東京 `ap-northeast-1` 想定。

---

## 2. ネットワーク（VPC・サブネット・セキュリティグループ）

### 作るもの

- **VPC** 1 つ。
- **public subnet**（EC2 用）: インターネットゲートウェイ経由で外に出られる。
- **private subnet ×2（異なる AZ）**（RDS 用）: RDS の DB サブネットグループは 2 つの AZ を要求するため 2 つ必要。private = インターネットから直接到達不可。
- **Internet Gateway** + public subnet のルートテーブルに `0.0.0.0/0 → IGW`。

### セキュリティグループ（SG）= 仮想ファイアウォール

- **ec2-sg**（EC2 に付与）
  - 22 (SSH): **自分の IP のみ**（`<my-ip>/32`）。全開放しない。
  - 80 (HTTP): `0.0.0.0/0`（Let's Encrypt の検証と 443 への誘導に必要）。
  - 443 (HTTPS): `0.0.0.0/0`。
- **rds-sg**（RDS に付与）
  - 3306 (MySQL): **送信元を ec2-sg にする**（IP 範囲ではなく SG を指定）。

> **なぜ SG を送信元に指定するのか**: EC2 の IP が変わっても、SG 参照なら壊れない。「この SG を持つインスタンスからだけ DB に入れる」と表現でき、最小権限で運用が楽。実務で評価されるポイント。

---

## 3. RDS MySQL の作成

1. **DB サブネットグループ**を作成（§2 の private subnet ×2 を登録）。
2. **RDS 作成**: Standard create → MySQL → テンプレート **Free tier**（⚠️ 表示は要再確認）→ `db.t4g.micro`。
3. **Public access = No**（private subnet・publicly accessible を無効）。
4. **VPC/SG**: §2 の VPC、`rds-sg` を割り当て。
5. マスターユーザー名/パスワードを控える（→ `docs/private/` に。本書には書かない）。
6. 作成完了後、**エンドポイント**（`xxx.rds.amazonaws.com`）を控える。

### 接続確認と「private subnet の落とし穴」

- private subnet の RDS は**手元の PC から直接は繋がらない**（public IP が無い）。
- **EC2 からは繋がる**（同 VPC・SG 許可済み）。EC2 に入って `mysql -h <endpoint> -u <user> -p` で疎通確認。
- 手元から触りたい場合は **踏み台(bastion)** か **SSM Session Manager**（SSH 鍵・public IP・NAT 不要、操作は CloudTrail に記録）でトンネルする。

### Django からの接続（SSL 注意）

- RDS はデフォルトで SSL 接続を要求する。Django の `DATABASES['default']['OPTIONS']` に SSL CA を渡す必要が出る場合がある（自己署名エラーが出たら CA 指定）。
- ドライバは `mysqlclient`（要ビルド依存・§4 で `build-essential` `default-libmysqlclient-dev` 等）を使う。

---

## 4. EC2 セットアップ

1. **起動**: Ubuntu 24.04 LTS、`t4g.micro`（Arm/Graviton）、public subnet、`ec2-sg`。
2. **Elastic IP** を割り当て（再起動で IP が変わらない固定 IP。DNS を向ける先になる）。
3. **SSH** で入る（鍵は `docs/private/` 管理・コミット禁止）。
4. パッケージ:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-dev build-essential \
    default-libmysqlclient-dev pkg-config nginx git
```

5. アプリ配置（home 直下では動かさない慣例。`/var/www/` へ）:

```bash
sudo mkdir -p /var/www/ippo && sudo chown $USER:$USER /var/www/ippo
cd /var/www/ippo
git clone <repo-url> .
python3 -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt gunicorn mysqlclient
```

---

## 5. バックエンド本番設定（**本人が実装** — 本書はチェックリスト）

> プロジェクト方針上、`backend/` のコード（settings 含む）は本人が手書きする。ここでは**設定すべき項目と理由**だけ挙げる。完成コードは載せない。`python manage.py check --deploy` の警告を 0 にするのがゴール。

- [x] `SECRET_KEY`: 環境変数から読む（本番用に新規生成。ハードコード禁止）。
- [x] `DEBUG = False`。
- [x] `ALLOWED_HOSTS`: `api.<domain>` を含める。
- [x] `DATABASES`: RDS の MySQL（HOST=エンドポイント、SSL 設定）。認証情報は環境変数。
- [x] `STATIC_ROOT` を設定し `python manage.py collectstatic`。
- [x] **CORS**（`django-cors-headers`）: `CORS_ALLOWED_ORIGINS = [Vercel の URL]`、`CORS_ALLOW_CREDENTIALS = True`。
- [x] **CSRF**: `CSRF_TRUSTED_ORIGINS = [Vercel の URL, api.<domain>]`。
- [x] **Cookie を `SameSite=None; Secure` に**: 認証 Cookie（`AUTH_COOKIE`）・`csrftoken`・session すべて `samesite='None'` + `secure=True`。§0 の別オリジン要件。DEBUG で分岐（開発は `Lax`）。
      - `csrftoken` は JS から読む必要があるので `httponly=False`（double-submit）。それ以外の値でも Secure/SameSite=None を揃える。
      - session Cookie も忘れず：`SESSION_COOKIE_SECURE = not DEBUG`・`SESSION_COOKIE_SAMESITE`（`check --deploy` の W012 で気づく）。
- [x] **`CSRF_COOKIE_DOMAIN`（same-site 化の要）**: フロントをサブドメイン運用にするなら `CSRF_COOKIE_DOMAIN = ".<domain>" if not DEBUG else None`。これで `csrftoken` が親ドメイン全体で読めるようになり、§0 の CSRF 403 を解消する。
- [x] **`SECURE_SSL_REDIRECT` / HSTS / `SESSION_COOKIE_*`**: `check --deploy` の W008/W004/W012/W021 を潰す（`SECURE_SSL_REDIRECT = not DEBUG`、`SECURE_HSTS_SECONDS`、`SECURE_HSTS_INCLUDE_SUBDOMAINS`、`SECURE_HSTS_PRELOAD`）。すべて DEBUG 分岐で本番のみ有効に。
      - 設定値は 3 種類に分けて考える：**env から読む**（SECRET_KEY・DB 認証・ALLOWED_HOSTS）/ **DEBUG から計算**（Cookie の samesite・secure）/ **固定値べた書き**（STATIC_ROOT のパス・SECURE_PROXY_SSL_HEADER のタプル）。全部 env にしようとすると壊れる。
- [x] **`SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`**: Nginx→Gunicorn 間は平文 HTTP。これが無いと Django が「HTTP 接続」と誤認し、`Secure` Cookie を発行しない／`SECURE_SSL_REDIRECT` がリダイレクトループになる。§7 の Nginx `X-Forwarded-Proto` とセット。
- [x] `SECURE_SSL_REDIRECT`・HSTS（`SECURE_HSTS_SECONDS` 等）: certbot 側でも 80→443 させるので二重になるが害は小さい。HSTS は本番のみ。
- [x] **throttling**（DRF）: 要件のブルートフォース対策。ログイン等にレート制限。（実施済み）
- [x] `migrate` 実行 → **自己登録方式**（公開サイトから新規登録して試用）。

---

## 6. Gunicorn を systemd で常駐（socket + service）

`/etc/systemd/system/gunicorn.socket`:

```ini
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

`/etc/systemd/system/gunicorn.service`（`WorkingDirectory`・`ExecStart` は実パスに合わせる）:

```ini
[Unit]
Description=Gunicorn daemon for ippo
Requires=gunicorn.socket
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ippo/backend
EnvironmentFile=/var/www/ippo/backend/.env
ExecStart=/var/www/ippo/venv/bin/gunicorn \
    --access-logfile - \
    --workers 3 \
    --bind unix:/run/gunicorn.sock \
    --timeout 120 \
    config.wsgi:application
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now gunicorn.socket
sudo systemctl status gunicorn.socket
```

- **worker 数**: 目安は `(2 × CPU コア) + 1`。t4g.micro は 2 vCPU なので式では 5 だが、**RAM 1GB** で 1 worker ≈ 50–100MB。OS/Django 込みで枯渇しないよう **3 程度が無難**。
- **なぜ socket + service の 2 本か**: socket 起動にしておくと、リクエストが来た時に systemd が Gunicorn を起こせる／権限分離が綺麗。`Restart=on-failure` でクラッシュ自動復帰。
- **ログ**: Django のエラーは Gunicorn の stdout → journald。`journalctl -u gunicorn -f` で追う。

---

## 7. Nginx（リバースプロキシ + 静的配信）

`/etc/nginx/sites-available/ippo`:

```nginx
server {
    listen 80;
    server_name api.<domain>;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        alias /var/www/ippo/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
        proxy_set_header X-Forwarded-Proto $scheme;   # §5 の SECURE_PROXY_SSL_HEADER と対
        proxy_read_timeout 120s;
    }

    client_max_body_size 10M;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ippo /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # デフォルトページが出る事故を防ぐ
sudo nginx -t && sudo systemctl restart nginx
```

- **なぜ Nginx が静的を配るか**: Gunicorn(WSGI) は静的ファイルを配れない。Nginx が直接返すことで Gunicorn の負荷を減らす。
- **権限の罠**: Nginx は `www-data` で動く。`collectstatic` が作るファイルを `www-data` が読めないと静的 404 になる。ディレクトリ権限に注意。

---

## 8. HTTPS 化（ドメイン + Let's Encrypt / certbot）

1. **DNS**: `api.<domain>` の A レコードを EC2 の **Elastic IP** に向ける。（フロントは §9 で `app.<domain>` を Vercel に向ける。）
2. **⚠️ certbot は snap 導入が公式推奨（要再確認）**:

```bash
sudo snap install core; sudo snap refresh core
sudo apt remove certbot -y            # apt 版が残っていると競合
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

3. 証明書取得（Nginx プラグインが証明書取得 + 設定書き換え + 80→443 リダイレクトまで自動）:

```bash
sudo certbot --nginx -d api.<domain>
```

- メール入力 → ToS 同意 → リダイレクトは「2（全 HTTP を HTTPS へ）」を選ぶ。
4. **自動更新**（証明書は 90 日で失効。snap は systemd タイマーで 1 日 2 回更新をチェック）:

```bash
sudo certbot renew --dry-run
```

> ここまでで `https://api.<domain>` が有効になり、§0 の `Secure` Cookie 要件を満たす。

---

## 9. フロントエンド（Vercel）

1. Vercel にリポジトリを連携（`frontend/` をルートに設定）。
2. 環境変数 `VITE_API_BASE_URL = https://api.<domain>`。
3. `frontend/vercel.json` にセキュリティヘッダ（HSTS/CSP、`unsafe-inline` 不使用）。
4. 独自ドメインを使うなら `app.<domain>` を Vercel に割り当て（DNS は Vercel の指示に従う）。
5. デプロイ → 確定したフロントの URL を控える。

---

## 10. 結線・検証

1. **backend の許可オリジンを確定 URL に更新**: `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` に Vercel の本番 URL を入れて再起動（`sudo systemctl restart gunicorn`）。
2. **`python manage.py check --deploy`** の警告が 0 か。
3. **スモークテスト 6 項目**（本番 URL に対して）:
   1. login → 4. の前に `Set-Cookie` が付くか
   2. `GET /api/values`（200・本人データのみ）
   3. `GET /api/csrf`（`csrftoken` Cookie が付く）
   4. `POST /api/refresh`（access/refresh 再発行）
   5. `X-CSRFToken` ヘッダ無しの POST が **403**
   6. logout（Cookie 削除・refresh blacklist）
4. **ブラウザ DevTools → Application → Cookies** で、認証 Cookie が `SameSite=None` `Secure` `HttpOnly` になっているか目視。ここが崩れていると「ログインできるのにリロードで落ちる」等の症状。

---

## 11. コスト管理・teardown

- **Budgets アラート**（§1）を必ず生かす。
- **⚠️ 無料枠を超えたら**: db.t4g.micro 24/7 で月 $11.5 前後、EC2・Elastic IP（未アタッチ時課金）にも注意。
- **teardown 順序**（使い終わり/クレジット枯渇時）: RDS 削除（最終スナップショット要否を判断）→ EC2 終了 → Elastic IP 解放 → NAT/IGW → VPC。ドメインは残す判断も可。

---

## 12. トラブルシュート早見表

| 症状 | まず見る所 |
|---|---|
| 502 Bad Gateway | Gunicorn 落ち。`journalctl -u gunicorn -n 50`、socket 存在確認 |
| 静的ファイル 404 | `collectstatic` 実行済みか／`staticfiles/` の権限（www-data 読めるか）／Nginx `alias` パス |
| CORS エラー（ブラウザ） | `CORS_ALLOWED_ORIGINS` に正確な Vercel URL、`CORS_ALLOW_CREDENTIALS=True` |
| 403（CSRF） | `CSRF_TRUSTED_ORIGINS`、フロントが `X-CSRFToken` を送っているか、Cookie の SameSite |
| ログインできるがリロードで落ちる | Cookie が `Secure`/`SameSite=None` で発行されているか、`SECURE_PROXY_SSL_HEADER` と Nginx の `X-Forwarded-Proto` |
| DB 接続不可 | rds-sg が ec2-sg から 3306 許可、同 VPC/リージョン、SSL 設定、エンドポイント |
| Nginx デフォルトページが出る | `sites-enabled/default` を消したか、`server_name` 一致、`nginx -t` |

---

## 13. 実施メモ・ハマりどころ（2026-07-02 実施）

実際にデプロイして詰まった点と対処。次回の自分・面接用の振り返り。

### 認証・CSRF（最大の山場）
- **cross-site だと認証 POST が 403**：フロント `*.vercel.app` × バック `api.<domain>` は別ドメイン。Cookie は `SameSite=None` で送れるが、JS が別ドメインの `csrftoken` を `document.cookie` で読めず `X-CSRFToken` を付けられない。ログイン等の未認証エンドポイントは通るので気づきにくい。
- **対処**：フロントも `app.<domain>`（同一親ドメインのサブドメイン）に載せ、`CSRF_COOKIE_DOMAIN = ".<domain>"`（本番のみ）で same-site 化。Vercel はカスタムドメイン追加 → DNS(Cloudflare 等)に CNAME（Vercel 運用なら **DNS only / プロキシ OFF**）。
- **`csrftoken` が 2 個できる**：`CSRF_COOKIE_DOMAIN` を後から変えると、旧（ホスト限定）と新（`.<domain>`）が同名で共存し稀に 403。テストブラウザの Cookie を消して再ログインで解消（新規ユーザーには起きない）。

### 接続・SSM
- EC2 は **SSM Session Manager** で接続（SSH 鍵不要・22 番を開けない）。前提：EC2 に IAM ロール（`AmazonSSMManagedInstanceCore`）、Ubuntu 24.04 は SSM エージェント同梱、public subnet + パブリック IP で外向き 443 確保。
- SSM セッションは毎回 `/var/snap/amazon-ssm-agent/...` に降りる。作業前に `cd /var/www/ippo && source venv/bin/activate` を習慣化。
- 既定シェルが `sh` のことがあり `source` が使えない → `bash` に入るか `.`（ドット）で代替。

### 環境変数・設定
- **`.env` の記号入り値はシングルクォート必須**：`SECRET_KEY` 等に `)` `&` `#` が入ると手動 `set -a; source .env` が構文エラー。`KEY='...'` で囲む（systemd の EnvironmentFile は独自パーサで平気だが、両対応のため囲む）。
- **`.env` に Python 設定を書かない**：`SECURE_HSTS_SECONDS = ...` のような行を `.env` に書くと `command not found`。`.env` は `KEY=値` のみ、Django 設定は `settings.py`。
- **手動 `manage.py` は `.env` を自動で読まない**：`set -a; source .env; set +a` で環境変数化してから実行（systemd 経由の gunicorn は EnvironmentFile で自動）。
- `check --deploy` を 0 issues にするのがゴール。W009 が出たら SECRET_KEY が env から読めていないサイン。

### フロント（Vite / Vercel）
- **`VITE_*` はビルド時に焼き込む**：Vercel で環境変数を足しても**再デプロイしないと反映されない**。
- **`VITE_API_BASE_URL` は `/api` まで含める**（コード側のデフォルトが `http://localhost:8000/api`）。末尾スラッシュは付けない。
- **`vercel.json` の CSP `connect-src`** にバック API ドメインを明記（プレースホルダ `REPLACE_WITH_API_ORIGIN` の置換忘れに注意）。
- **CORS / CSRF のオリジンに末尾スラッシュを付けない**：`https://app.<domain>`（`/` 無し）。Origin ヘッダと文字列一致しないと弾かれる。

### インフラ
- **NAT ゲートウェイは作らない**（VPC ウィザードで `None`）。RDS は private でも外向き不要。付けると月 $30〜。
- **RDS は SSL 強制ではなかった**：`migrate` は SSL オプション無しで通った（より堅くするなら `OPTIONS` に CA 指定）。疎通は EC2 から `mysql --ssl-mode=VERIFY_IDENTITY --ssl-ca=global-bundle.pem` で先に確認すると切り分けが楽。
- **DNS 反映確認は権威に直接問う**：`dig +short <host> @1.1.1.1`。ローカルリゾルバのキャッシュに惑わされない。Cloudflare はプロキシ ON(オレンジ)だと dig が Cloudflare IP を返す → certbot 用途では **DNS only(灰色)** に。
- **Elastic IP** はインスタンスに関連付けている限り無料。未アタッチ課金に注意。

---

## 参考リンク（最終確認 2026-07-01・⚠️ 変動項目は公式で再確認）

- Django + Gunicorn + Nginx + HTTPS 本番構成: [Real Python](https://realpython.com/django-nginx-gunicorn/) / [Ubuntu 24.04 walkthrough](https://www.progressiverobot.com/2026/05/16/deploy-django-gunicorn-nginx-ubuntu-24-04/)
- Certbot 公式（Nginx / snap）: [certbot.eff.org](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal) / [DigitalOcean guide](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)
- AWS 無料利用枠（RDS/Aurora）: [aws.amazon.com/rds/free](https://aws.amazon.com/rds/free/)
- EC2↔RDS を SG で接続（公式）: [AWS docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/tutorial-ec2-rds-option3.html)
- RDS を private subnet に置いた後の接続: [awsfundamentals.com](https://awsfundamentals.com/blog/your-rds-is-in-a-private-subnet-now-what)
