# Firebase 認証セットアップガイド

## 手順 1: Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例: `vending-viewer`）
4. Google Analytics を有効にするか選択（オプション）
5. 「プロジェクトを作成」をクリック

## 手順 2: ウェブアプリの登録

1. Firebase Console で作成したプロジェクトを開く
2. プロジェクト設定 → アプリを追加 → ウェブ
3. アプリのニックネーム（例: `vending-viewer-web`）を入力
4. 「アプリを登録」をクリック
5. Firebase SDK 情報をコピー

## 手順 3: 認証を有効化

1. 左メニューから「Authentication」をクリック
2. 「Sign-in method」をクリック
3. **Email/Password** を有効にする
   - 「Email/Password」をクリック
   - トグルを有効にしてを「保存」
   - 「メール リンクでのサインイン」は無効にする（オプション）

## 手順 4: Firestore Database をセットアップ

1. 左メニューから「Firestore Database」をクリック
2. 「データベースを作成」をクリック
3. リージョン: `asia-northeast1`（日本）を選択
4. セキュリティルール: 「本番環境モード」を選択
5. 「作成」をクリック

## 手順 5: Cloud Storage をセットアップ

1. 左メニューから「Storage」をクリック
2. 「開始」をクリック
3. セキュリティルールを選択
4. ロケーション: `asia-northeast1`（日本）を選択
5. 「完了」をクリック

## 手順 6: 環境変数を設定

1. Firebase プロジェクト設定から **SDK 情報** をコピー
2. プロジェクト直下に `.env.local` ファイルを作成
3. 以下の環境変数を設定：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 手順 7: セキュリティルール（Firestore）を更新

Firebase Console → Firestore Database → ルール

以下を参照: `lib/firestore-schema.md` の「セキュリティルール」セクション

## 手順 8: セキュリティルール（Cloud Storage）を更新

Firebase Console → Storage → ルール

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }

    match /vending-machines/{allPaths=**} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && request.auth.uid == resource.metadata.uploadedBy;
    }

    match /users/{uid}/{allPaths=**} {
      allow read: if isAuthenticated() && request.auth.uid == uid;
      allow write: if isAuthenticated() && request.auth.uid == uid;
    }
  }
}
```

## トラブルシューティング

### 「Firebase is not initialized" エラー
- 環境変数 `.env.local` が正しく設定されているか確認
- `npm run dev` で開発サーバーを再起動

### 認証がうまくいかない
- Firebase Console で Email/Password が有効か確認
- ブラウザのコンソールでエラーメッセージを確認

### Firestore へのアクセスが拒否される
- セキュリティルールが正しく設定されているか確認
- ユーザーが認証済みか確認
