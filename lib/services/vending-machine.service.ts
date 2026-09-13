import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  offset,
  getDocs,
  getDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { VendingMachine, Product, SearchFilters } from '../../types';

/**
 * 自動販売機サービス
 */
export class VendingMachineService {
  /**
   * 新しい自動販売機を登録
   */
  static async createVendingMachine(
    machineData: Omit<VendingMachine, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites'>,
    imageFile?: File
  ): Promise<string> {
    try {
      let mainImageUrl = machineData.mainImage;

      // 画像を Cloud Storage にアップロード
      if (imageFile) {
        const imageRef = ref(storage, `vending-machines/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        mainImageUrl = await getDownloadURL(imageRef);
      }

      // Firestore にドキュメントを作成
      const docRef = await addDoc(collection(db, 'vending-machines'), {
        ...machineData,
        mainImage: mainImageUrl,
        views: 0,
        favorites: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating vending machine:', error);
      throw error;
    }
  }

  /**
   * 機禨情報を取得
   */
  static async getVendingMachine(machineId: string): Promise<VendingMachine | null> {
    try {
      const machineRef = doc(db, 'vending-machines', machineId);
      const machineSnap = await getDoc(machineRef);

      if (!machineSnap.exists()) {
        return null;
      }

      return {
        ...machineSnap.data(),
        id: machineSnap.id,
      } as VendingMachine;
    } catch (error) {
      console.error('Error getting vending machine:', error);
      throw error;
    }
  }

  /**
   * 機禨情報を更新
   */
  static async updateVendingMachine(
    machineId: string,
    updateData: Partial<VendingMachine>
  ): Promise<void> {
    try {
      const machineRef = doc(db, 'vending-machines', machineId);
      await updateDoc(machineRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating vending machine:', error);
      throw error;
    }
  }

  /**
   * 機禨を削除
   */
  static async deleteVendingMachine(machineId: string): Promise<void> {
    try {
      const machineRef = doc(db, 'vending-machines', machineId);
      await deleteDoc(machineRef);
    } catch (error) {
      console.error('Error deleting vending machine:', error);
      throw error;
    }
  }

  /**
   * 検索情報に基づいて機禨を検索
   */
  static async searchVendingMachines(
    filters: SearchFilters
  ): Promise<VendingMachine[]> {
    try {
      let q = query(collection(db, 'vending-machines'));
      const constraints = [];

      // フィルター条件を構競
      if (filters.type) {
        constraints.push(where('type', '==', filters.type));
      }
      if (filters.prefecture) {
        constraints.push(where('location.prefecture', '==', filters.prefecture));
      }
      if (filters.tags && filters.tags.length > 0) {
        constraints.push(where('tags', 'array-contains-any', filters.tags));
      }

      // 並べ際を与える
      switch (filters.sortBy) {
        case 'recent':
          constraints.push(orderBy('createdAt', 'desc'));
          break;
        case 'popular':
          constraints.push(orderBy('views', 'desc'));
          break;
        case 'rating':
          constraints.push(orderBy('rating', 'desc'));
          break;
        default:
          constraints.push(orderBy('createdAt', 'desc'));
      }

      // ページング
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }
      if (filters.offset) {
        constraints.push(offset(filters.offset));
      }

      q = query(collection(db, 'vending-machines'), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as VendingMachine[];
    } catch (error) {
      console.error('Error searching vending machines:', error);
      throw error;
    }
  }

  /**
   * 認を開計す
   */
  static async incrementViews(machineId: string): Promise<void> {
    try {
      const machineRef = doc(db, 'vending-machines', machineId);
      await updateDoc(machineRef, {
        views: arrayUnion ? (await this.getVendingMachine(machineId))?.views || 0 + 1 : 1,
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }

  /**
   * お気に入り機能を実装
   */
  static async toggleFavorite(machineId: string, userId: string, isFavorite: boolean): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(machineId),
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(machineId),
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
}
