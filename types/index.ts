/**
 * 自動販売機アプリの粗型定義
 */

/** 自動販売機情報 */
export interface VendingMachine {
  id: string;                    // 一一に付与ID
  name: string;                   // 機禨の名前
  type: VendingMachineType;        // 機禨の種類
  location: {
    latitude: number;              // 緑度
    longitude: number;             // 経度
    address: string;               // 住所
    prefecture: string;            // 連… (皆々靶、層化、など)
  };
  mainImage: string;              // イメージURL
  description: string;            // 説明
  products: Product[];            // 内容物リスト
  manufacturer?: string;          // 製造会社
  installDate?: string;           // 設罫日
  views: number;                  // 閉覧数
  favorites: number;              // お気に入り数
  imageGallery: string[];         // 複数枚の画像
  tags: string[];                 // タグ (e.g., "hot", "cold", "snack")
  createdAt: number;              // 作成日時
  updatedAt: number;              // 更新日時
  createdBy: string;              // 作成者UID
  rating: number;                 // 計数平均計 (0-5)
}

/** 自動販売機の種類 */
export type VendingMachineType = 'beverage' | 'snack' | 'combo' | 'specialty';

/** 商品情報 */
export interface Product {
  id: string;                     // 商品ID
  name: string;                   // 商品名
  category: string;               // カテゴリ (e.g., "soft drink", "candy", "coffee")
  price: number;                  // 価格 (円)
  image?: string;                 // 商品画像
  position?: string;              // 【佋】 "A-1", "B-3" (購买位置)
  description?: string;           // 説明
}

/** ユーザー情報 */
export interface User {
  uid: string;                    // Firebase UID
  email: string;                  // メールアドレス
  displayName: string;            // 表示名
  profileImage?: string;          // プロフィール画像
  bio?: string;                   // 自己紹介
  favorites: string[];            // お気に入り機禨IDのリスト
  submittedMachines: string[];    // 投稿機禨IDのリスト
  role: UserRole;                 // ユーザー役割
  createdAt: number;              // 作成日時
  updatedAt: number;              // 更新日時
}

/** ユーザー役割 */
export type UserRole = 'user' | 'moderator' | 'admin';

/** レビュー・計次 */
export interface Review {
  id: string;                     // レビューID
  machineId: string;              // 機禨ID
  userId: string;                 // ユーザーID
  rating: number;                 // 計数 (1-5)
  comment: string;                // コメント
  createdAt: number;              // 作成日時
}

/** 検索フィルター */
export interface SearchFilters {
  type?: VendingMachineType;      // 機禨種類
  prefecture?: string;            // 連
  tags?: string[];                // タグ
  sortBy?: 'recent' | 'popular' | 'rating'; // 並べ時顺
  limit?: number;                 // 取得件数
  offset?: number;                // オフセット
}

/** ジオコーディング検索結果 */
export interface GeoSearchResult {
  machines: VendingMachine[];
  center: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
}
