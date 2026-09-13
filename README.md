# 🤖 自動販売機コンテンツ閲覧アプリ

様々な自動販売機の中身を写真で確認できるアプリケーション。

## 機能

- ✅ 自動販売機の写真・情報を登録
- ✅ 自動販売機の中身（商品）を閲覧
- ✅ 地域・種類ごとに検索・フィルタリング
- ✅ ユーザー投稿機能
- ✅ お気に入り機能

## 技術スタック

- **フロントエンド**: Next.js 14 + React 18 + TypeScript
- **バックエンド**: Firebase
- **データベース**: Cloud Firestore
- **ストレージ**: Cloud Storage
- **認証**: Firebase Authentication

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/knz-group/knz-homepage.git
cd knz-homepage
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.local.example` をコピーして `.env.local` を作成し、Firebase認証情報を入力

```bash
cp .env.local.example .env.local
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

`http://localhost:3000` でアプリが起動します。

## ディレクトリ構成

```
.
├── app/              # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/         # API Routes
├── components/       # React コンポーネント
├── lib/             # ユーティリティ関数
│   └── firebase.ts  # Firebase 初期化
├── types/           # TypeScript型定義
└── public/          # 静的ファイル
```

## 開発フロー

1. フーチャーブランチを作成: `git checkout -b feature/your-feature`
2. コミット: `git commit -m "feat: description"`
3. プッシュ: `git push origin feature/your-feature`
4. プルリクエストを作成

## ライセンス

MIT
