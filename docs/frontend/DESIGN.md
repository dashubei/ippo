# ippo デザインガイド

最終更新: 2026-06-28
ベース: challenger プロジェクトの UI を継承・発展

---

## 1. デザイン原則

- **モバイルファースト**: 主要ユーザーはスマートフォン。モバイルで設計し、デスクトップへ拡張する
- **安心感・温かみ**: 不安に関わるアプリのため、圧迫感を与えない色・余白・丸みを意識する
- **シンプル・集中**: 一画面に情報を詰め込みすぎない。ユーザーが次の行動に迷わないデザイン
- **アクセシビリティ**: フォーカスリング表示・`prefers-reduced-motion` 対応を基本とする

---

## 2. カラーパレット

Warm therapy palette（challenger から継承）。

| 変数 | 値 | 用途 |
|---|---|---|
| `--cream` | `#fff6ec` | 背景ベース |
| `--cream-2` | `#fdefe2` | 背景グラデーション中間 |
| `--cream-3` | `#f8e6d6` | 背景グラデーション底 |
| `--ink` | `#4b3f36` | 本文テキスト（温かいダークブラウン） |
| `--ink-soft` | `#8a7d70` | 補助テキスト・プレースホルダー |
| `--accent` | 画面ごとに検討 | CTA ボタン・フォーカスリング・アクセントバー |

背景は radial-gradient でクリーム系グラデーション：

```css
background: radial-gradient(
  120% 80% at 50% 0%,
  #fffaf3 0%,
  var(--cream) 35%,
  var(--cream-2) 70%,
  var(--cream-3) 100%
);
```

---

## 3. タイポグラフィ

```css
font-family: "Zen Maru Gothic", "M PLUS Rounded 1c",
             "Hiragino Maru Gothic ProN", "Hiragino Kaku Gothic ProN",
             "Noto Sans JP", system-ui, sans-serif;
```

- 丸ゴシック系を優先し、やわらかい印象を与える
- 本文: `--ink`（#4b3f36）
- 補助テキスト: `--ink-soft`（#8a7d70）
- `-webkit-font-smoothing: antialiased` を適用

---

## 4. コンポーネントパターン

### グラスモーフィズムカード（メインパネル）

```css
bg-white/65 backdrop-blur-2xl border border-white/70
shadow-[0_-2px_40px_rgba(75,63,54,0.12)]
rounded-3xl overflow-hidden
```

### プライマリボタン

```css
bg-[var(--accent)] text-white font-bold rounded-2xl py-3
active:scale-[0.98] transition-transform
disabled:opacity-50 disabled:active:scale-100
```

### アイコンボタン（ヘッダー等）

```css
grid place-items-center w-10 h-10 rounded-full
bg-white/60 backdrop-blur-md shadow-sm
hover:bg-white/80 transition-colors
```

### フォーム入力

細部は実装時に確定。エラーテキストは `--ink-soft` より濃い赤系、背景色付きで視認性を確保。

---

## 5. アニメーション

challenger のキーフレームを継承。

| クラス | 用途 | イージング |
|---|---|---|
| `animate-panel-rise` | パネル・カードの初期表示（下から浮き上がり） | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `animate-soft-fade` | テキスト・ローディング文言のフェードイン | `ease` |
| `animate-sheet-up` | ボトムシートの展開 | `cubic-bezier(0.22, 1, 0.36, 1)` |

- `prefers-reduced-motion: reduce` で全アニメーション無効化（必須）
- アニメーションは控えめに。ユーザーの操作を邪魔しない

---

## 6. ローディングパターン

| 状況 | パターン |
|---|---|
| データ取得（一覧・詳細など） | **Skeleton** — コンテンツと同じ形状のグレーブロック |
| フォーム送信・処理待ち | **Spinner** — ボタン内またはオーバーレイ |

Skeleton は最終レイアウトと幅・高さを揃える（ガタつき防止）。

---

## 7. セーフエリア対応

iPhone のノッチ（上部切り欠き）・ホームインジケーター（下部バー）を考慮し、コンテンツが隠れないよう余白を確保する。

```css
/* ヘッダー上部 */
pt-[calc(env(safe-area-inset-top)+1rem)]

/* ボトムパネル・ナビゲーション下部 */
pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
```

---

## 8. ページ構成

| パス | 画面 | 認証 |
|---|---|---|
| `/login` | ログイン | 不要 |
| `/register` | 新規登録 | 不要 |
| `/values` | 価値一覧・追加・編集 | 要 |
| `/exposures` | 曝露記録一覧（カレンダー） | 要 |
| `/exposures/new` | 曝露記録の作成 | 要 |
| `/exposures/:id` | 詳細・実施後追記 | 要 |

認証が必要なページは未ログイン時に `/login` へリダイレクト。

---

## 9. その他ルール

- タップハイライト非表示: `-webkit-tap-highlight-color: transparent`
- クリッカブル要素は `cursor: pointer`（button, a, [role="button"]）
- 高さ基準は `100svh`（svh = small viewport height、ブラウザのアドレスバーを除外した高さ）
- タッチターゲットは最低 44×44px を確保
