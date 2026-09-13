import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../../types';

/**
 * ユーザーサービス
 */
export class UserService {
  /**
   * 新しいユーザーを作成
   */
  static async createUser(
    uid: string,
    userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt' | 'favorites' | 'submittedMachines'>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...userData,
        uid,
        favorites: [],
        submittedMachines: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }).catch(() =>
        // ドキュメントが存在しない場合を处理
        db.collection('users').doc(uid).set({
          ...userData,
          uid,
          favorites: [],
          submittedMachines: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
      );
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * ユーザー情報を取得
   */
  static async getUser(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      return userSnap.data() as User;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * ユーザー情報を更新
   */
  static async updateUser(uid: string, updateData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * ユーザーの投稿機禨を取得
   */
  static async getUserSubmittedMachines(uid: string): Promise<string[]> {
    try {
      const user = await this.getUser(uid);
      return user?.submittedMachines || [];
    } catch (error) {
      console.error('Error getting user submitted machines:', error);
      throw error;
    }
  }

  /**
   * ユーザーのお気に入り機禨を取得
   */
  static async getUserFavoriteMachines(uid: string): Promise<string[]> {
    try {
      const user = await this.getUser(uid);
      return user?.favorites || [];
    } catch (error) {
      console.error('Error getting user favorite machines:', error);
      throw error;
    }
  }
}
