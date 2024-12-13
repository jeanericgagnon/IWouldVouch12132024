import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { USERS } from '../collections';
import type { FirestoreUser } from '../collections';
import { convertFirestoreData } from '../utils';

export const userService = {
  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, USERS, userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return null;
      }

      return {
        id: userSnap.id,
        ...convertFirestoreData(userSnap.data())
      } as FirestoreUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  },

  /**
   * Create a new user
   */
  async createUser(userId: string, userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await setDoc(doc(db, USERS, userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  /**
   * Update user data
   */
  async updateUser(userId: string, updates: Partial<Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const userRef = doc(db, USERS, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }
};