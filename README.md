# ippo（イッポ）

社交場面での不安に、**自分の「価値（大切にしたいこと）」に紐づけた小さな一歩**を記録し、振り返るためのセルフヘルプ Web アプリです。

- **誰のためか**：人前での発言・交流など、社交場面で不安を感じる思春期以上の人。
- **何ができるか**：怖いと感じる行動（曝露）を「どんな価値に繋がるか」とともに記録し、実施前後の不安を残して、カレンダーで振り返れます。
- **何のためか**：心理学（CBT／ACT）の考え方を、誰でも手軽に使える形にすることを目指した個人開発プロジェクトです。

---

## 特徴
- 🎯 **価値に紐づく記録**：行動を「自分が大切にしたいこと（価値）」に結びつけて記録します。
- 📉 **不安の前後を記録**：実施前・実施後の不安（0–100）を残します。
- 🗓 **カレンダーで振り返り**：実施した日を俯瞰し、その日の記録を確認できます。

## 位置づけ（重要）
ippo は **非医療のセルフヘルプ／教育ツール**です。**治療・診断・寛解などの効果は標榜しません。**
治療用アプリ（医療機器）として提供する場合は薬機法上の承認プロセスが必要であり、本アプリはその対象外として設計しています。

## ステータス
バックエンド実装完了（API 全エンドポイント動作確認済み）。フロントエンド実装中。

## 試用
練習用アカウントを用意しています（後述）。ゲストログイン機能は設けず、事前作成済みのアカウントで試用できます。

## 技術スタック
| レイヤー | 採用技術 |
|---|---|
| バックエンド | Python 3.12 + Django 6 + Django REST Framework |
| 認証 | JWT（`djangorestframework-simplejwt`） |
| データベース | SQLite（開発）/ MySQL on AWS RDS（本番） |
| フロントエンド | React + Vite + TypeScript + Tailwind CSS |
| インフラ | AWS EC2 + RDS（バックエンド）、Vercel（フロントエンド） |

詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照。

## ローカル起動（開発環境）
```bash
# バックエンド
cd backend
python3 -m venv .venv
source .venv/bin/activate     # Linux / WSL / macOS
# .venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## ドキュメント
- [開発ガイド](docs/DEVELOPMENT.md)
- [要件定義書](docs/requirements.md)
- [技術選定](docs/tech-stack.md)
- [データモデル / ER 図](docs/backend/er.md)
- [API 設計](docs/backend/api.md)
- [デザインガイド](docs/frontend/DESIGN.md)
- [テスト方針](docs/frontend/TESTING.md)

## 背景にある考え方（簡単に）
- **曝露（エクスポージャー）**：不安な場面に少しずつ取り組み、「慣れ」を促すアプローチ。
- **価値の明確化（ACT）**：「どんな人でありたいか」を言葉にし、行動をそこに結びつける。これにより、行動の自然な結果（やれた・人と関われた等）の動機づけとしての働きが高まりやすくなる、という行動分析の考え方（augmenting）に基づいています。
