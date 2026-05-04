# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**03_task_board** — SAMURAI SPRINT シリーズ第 3 弾。React + Vite で構築したタスク管理アプリ。  
チェックボックスによる完了切り替え・削除・localStorage 永続化をサポートする。

## 開発コマンド

```bash
npm install      # 初回セットアップ
npm run dev      # 開発サーバー起動 → http://localhost:5173
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をローカル確認
```

## Git 運用ルール

**コードを変更するたびに必ず GitHub にプッシュすること。**

```bash
git add .
git commit -m "コミットメッセージ"
git push origin main
```

- リモートリポジトリ: `https://github.com/kazupu2025/task-board.git`
- `main` ブランチ直 push で運用（フィーチャーブランチ不要）
- コミットメッセージは日本語 OK

## アーキテクチャ

コンポーネントは `src/App.jsx` 1 ファイルに集約（`App` + `TaskItem` + `CheckIcon`）。

- **状態** — `tasks` 配列（`{ id, text, completed }`）を `useState` で管理。`localStorage` キーは `task-board-v1`。
- **永続化** — `useEffect` で `tasks` 変化のたびに `localStorage.setItem` を呼ぶ。初期値は `useState` のイニシャライザで `localStorage.getItem` から復元。
- **スタイル** — CSS Custom Properties (`--bg`, `--accent` 等) を `:root` で一元定義。`--i` インデックスを React の `style` prop 経由で渡し `animation-delay: calc(var(--i) * 0.04s)` で stagger アニメーションを実現。
- **フォント** — Fraunces（タイトル serif）× DM Mono（本文等幅）。`index.html` の `<link>` でロード。

## ファイル構成

```
03_task_board/
├── src/
│   ├── App.jsx      # App + TaskItem + CheckIcon コンポーネント
│   ├── App.css      # 全スタイル（CSS Custom Properties）
│   ├── main.jsx     # React エントリポイント
│   └── index.css    # box-sizing リセットのみ
├── index.html       # フォント <link> を含む HTML テンプレート
├── vite.config.js   # Vite 設定（@vitejs/plugin-react）
└── package.json
```

## デプロイ先

**本番 URL**: https://kazupu2025.github.io/task-board/

`main` へのプッシュで GitHub Actions が自動ビルド＆デプロイ（`.github/workflows/deploy.yml`）。  
ワークフロー確認: https://github.com/kazupu2025/task-board/actions

## 技術スタック

| 用途 | ライブラリ / ツール |
|------|-------------------|
| UI フレームワーク | React 19 |
| ビルドツール | Vite 6 |
| スタイリング | Plain CSS + CSS Custom Properties（フレームワークなし） |
| フォント | Fraunces（タイトル）/ DM Mono（本文）— Google Fonts |
| 永続化 | localStorage（外部ライブラリなし） |
| ホスティング | GitHub Pages |
| CI/CD | GitHub Actions |

## コーディング規約

- `var` 禁止。`const` / `let` を使う
- コンポーネントは関数コンポーネントのみ（クラスコンポーネント禁止）
- 状態は `App` で一元管理し、子へは props で渡す
- CSS クラスはスタイル専用、DOM 操作に使わない

### コンポーネント命名

| 種別 | 規則 | 例 |
|------|------|----|
| コンポーネント名 | PascalCase | `App`, `TaskItem`, `CheckIcon` |
| イベントハンドラ props | `on` + PascalCase | `onToggle`, `onDelete` |
| ハンドラ関数（定義側） | camelCase の動詞句 | `addTask`, `toggleTask`, `deleteTask` |
| CSS クラス | kebab-case | `task-item`, `delete-btn`, `add-btn` |
| CSS カスタムプロパティ | `--` + kebab-case | `--bg`, `--accent`, `--text-muted` |

新しいコンポーネントを追加する場合は `src/` 直下に `ComponentName.jsx` / `ComponentName.css` のペアで配置する。
