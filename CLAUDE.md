# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**03_task_board** — SAMURAI SPRINT シリーズ第 3 弾。タスク管理ボードアプリ。  
バニラ HTML/CSS/JavaScript で構築し、外部フレームワーク・ビルドツールは使用しない。  
データは `localStorage` に永続化する。

## 開発サーバーの起動

ビルド手順は不要。以下のいずれかでローカル確認する：

```bash
# Python（推奨）
python -m http.server 8080

# Node.js
npx serve .
```

ブラウザで `http://localhost:8080` にアクセス。`index.html` を直接ファイルで開いても動作する。

## Git 運用ルール

**コードを変更するたびに必ず GitHub にプッシュすること。**

```bash
# 変更後の基本フロー
git add .
git commit -m "コミットメッセージ"
git push origin main
```

- リモートリポジトリ: `https://github.com/kazupu2025/Task_Board.git`（未作成の場合は作成してから設定）
- `main` ブランチ直 push で運用（フィーチャーブランチ不要）
- コミットメッセージは日本語 OK

## アーキテクチャ

`script.js` の責務は以下のとおり分離する：

- **データ** — タスクオブジェクトの配列。各タスクは `{ id, title, status, createdAt }` 形式。`status` は `"todo" | "doing" | "done"` の 3 値。
- **永続化** — `localStorage` への読み書きは `loadTasks()` / `saveTasks()` のみを通す。
- **状態** — インメモリの `tasks` 配列を単一の信頼できる情報源とする。
- **描画** — `renderBoard()` が全カラムを再描画（差分更新ではなく全再描画）。
- **イベント** — タスク追加・ステータス変更・削除のハンドラを `bindEvents()` で一括登録。

## ファイル構成（予定）

```
03_task_board/
├── index.html   # 3カラム（ToDo / Doing / Done）のボードレイアウト
├── style.css    # 全スタイル（CSS Custom Properties でカラー管理）
└── script.js    # 全ロジック（状態・localStorage・DOM操作）
```

## コーディング規約

`01_quiz_app` / `02_weather` と共通：

- `var` 禁止。`const` / `let` を使う
- `'use strict'` をファイル先頭に記述
- DOM 取得は `getElementById` / `querySelector` で統一。クラスセレクタはスタイル専用
- グローバル変数禁止。状態は `script.js` 内のクロージャで管理
- `localStorage` のキー名は定数 `STORAGE_KEY` で一元管理
