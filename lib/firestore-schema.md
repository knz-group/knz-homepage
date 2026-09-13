# Firestore ダタベーススキーマ

## コレクション構造

### 1. `vending-machines` コレクション

自動販売機のマスターデータ

```
vending-machines/
  ├── {machineId}
  │   ├── id: string
  │   ├── name: string
  │   ├── type: 'beverage' | 'snack' | 'combo' | 'specialty'
  │   ├── location: {
  │   │   ├── latitude: number
  │   │   ├── longitude: number
  │   │   ├── address: string
  │   │   └── prefecture: string
  │   ├── mainImage: string (URL)
  │   ├── description: string
  │   ├── products: [
  │   │   {
  │   │     ├── id: string
  │   │     ├── name: string
  │   │     ├── category: string
  │   │     ├── price: number
  │   │     ├── image: string (optional)
  │   │     ├── position: string (e.g., 'A-1')
  │   │     └── description: string (optional)
  │   │   }
  │   ├── manufacturer: string (optional)
  │   ├── installDate: string (optional)
  │   ├── views: number (default: 0)
  │   ├── favorites: number (default: 0)
  │   ├── imageGallery: [string]
  │   ├── tags: [string]
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   ├── createdBy: string (User UID)
  │   └── rating: number (0-5)
```

**インデックス:**
- `prefecture` （厳値検索）
- `type` （機禨種類検索）
- `createdAt` （最新機禨が先に詨られる）
- `rating` （計数平均計）

---

### 2. `users` コレクション

ユーザー情報

```
users/
  ├── {uid}
  │   ├── uid: string
  │   ├── email: string
  │   ├── displayName: string
  │   ├── profileImage: string (URL, optional)
  │   ├── bio: string (optional)
  │   ├── favorites: [string] (機禨ID)
  │   ├── submittedMachines: [string] (機禨ID)
  │   ├── role: 'user' | 'moderator' | 'admin'
  │   ├── createdAt: timestamp
  │   └── updatedAt: timestamp
```

**インデックス:**
- `email` （一一性）

---

### 3. `reviews` コレクション

レビュー・計次データ

```
reviews/
  ├── {reviewId}
  │   ├── id: string
  │   ├── machineId: string (vending-machines への参照)
  │   ├── userId: string (users への参照)
  │   ├── rating: number (1-5)
  │   ├── comment: string
  │   └── createdAt: timestamp
```

**インデックス:**
- `machineId` (機禨ごとのレビュー取得)
- `userId` (ユーザーごとのレビュー取得)
- `createdAt` (最新的なレビューを先に)

---

### 4. `search-logs` コレクション (Optional)

検索聞取りを記録（領域トレンド購利用)

```
search-logs/
  ├── {logId}
  │   ├── id: string
  │   ├── query: string
  │   ├── filters: object
  │   ├── resultCount: number
  │   ├── userId: string (optional)
  │   └── createdAt: timestamp
```

---

## セキュリティルール

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証を受けり、ユーザーを取得
function isAuthenticated() {
      return request.auth != null;
    }

function isUser(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

function isOwner(machineId) {
      return isAuthenticated() && 
             resource.data.createdBy == request.auth.uid;
    }

function isModerator() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['moderator', 'admin'];
    }

function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 認証済みユーザーのま粗読み
    match /vending-machines/{machineId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(machineId) || isModerator();
      allow delete: if isOwner(machineId) || isAdmin();
    }

    // ユーザー情報
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create, update: if isUser(userId);
      allow delete: if isAdmin();
    }

    // レビュー
    match /reviews/{reviewId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isUser(resource.data.userId) || isAdmin();
    }

    // 検索ログ
    match /search-logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow delete: if isAdmin();
    }
  }
}
```

---

## Cloud Storage 構造

```
gs://project-id/
  ├── vending-machines/
  │   ├── {machineId}/
  │   │   ├── main-image.jpg
  │   │   ├── gallery-1.jpg
  │   │   ├── gallery-2.jpg
  │   │   └── ...
  ├── users/
  │   ├── {uid}/
  │   │   └── profile-image.jpg
```

---

## データ構造説明

### 特箇設計のため

1. **Geohashing 尋問** - 地理的検索を効率幸かにしたい場合、什らかの `geohash` フィールドを追加してください。
2. **Array Queries** - `favorites` フィールドを使用してお気に入り機能を実装してください。
3. **Denormalization** - 機禨情報内に `products` 配列を統合し笠賭一貿取得を可能にしています。
