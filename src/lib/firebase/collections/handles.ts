import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config';

const HANDLES_COLLECTION = 'handles';

export const handlesCollection = {
  /**
   * Reserve a handle for a user
   */
  async reserveHandle(handle: string, userId: string): Promise<boolean> {
    try {
      // Check if handle exists
      const handleRef = doc(db, HANDLES_COLLECTION, handle);
      const handleDoc = await getDoc(handleRef);

      if (handleDoc.exists()) {
        return false;
      }

      // Create handle document
      await setDoc(handleRef, {
        userId,
        handle,
        createdAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error reserving handle:', error);
      return false;
    }
  },

  /**
   * Get user ID by handle
   */
  async getUserIdByHandle(handle: string): Promise<string | null> {
    try {
      const handleRef = doc(db, HANDLES_COLLECTION, handle);
      const handleDoc = await getDoc(handleRef);

      if (!handleDoc.exists()) {
        return null;
      }

      return handleDoc.data().userId;
    } catch (error) {
      console.error('Error getting user by handle:', error);
      return null;
    }
  },

  /**
   * Get handle by user ID
   */
  async getHandleByUserId(userId: string): Promise<string | null> {
    try {
      const q = query(collection(db, HANDLES_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      return querySnapshot.docs[0].id;
    } catch (error) {
      console.error('Error getting handle by user ID:', error);
      return null;
    }
  }
};