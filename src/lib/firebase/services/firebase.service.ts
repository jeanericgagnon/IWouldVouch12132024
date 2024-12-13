import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  serverTimestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config';
import { USERS, RECOMMENDATIONS } from '../collections';
import type { FirestoreUser, FirestoreRecommendation } from '../collections';
import { convertFirestoreData } from '../utils';

const BATCH_SIZE = 10;

export const userService = {
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

export const recommendationService = {
  async createRecommendation(data: Omit<FirestoreRecommendation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, RECOMMENDATIONS), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating recommendation:', error);
      throw new Error('Failed to create recommendation');
    }
  },

  async getRecommendation(id: string): Promise<FirestoreRecommendation | null> {
    try {
      const docRef = doc(db, RECOMMENDATIONS, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...convertFirestoreData(docSnap.data())
      } as FirestoreRecommendation;
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      throw new Error('Failed to fetch recommendation');
    }
  },

  async getUserRecommendations(
    userId: string,
    status?: 'pending' | 'approved' | 'rejected',
    lastDoc?: DocumentSnapshot
  ): Promise<{
    recommendations: FirestoreRecommendation[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
  }> {
    try {
      let q = query(
        collection(db, RECOMMENDATIONS),
        where('recipient.id', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(BATCH_SIZE));

      const querySnapshot = await getDocs(q);
      const recommendations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertFirestoreData(doc.data())
      })) as FirestoreRecommendation[];

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const hasMore = querySnapshot.docs.length === BATCH_SIZE;

      return {
        recommendations,
        lastDoc: lastVisible || null,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Failed to fetch recommendations');
    }
  },

  async updateRecommendationStatus(
    id: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    try {
      const docRef = doc(db, RECOMMENDATIONS, id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      throw new Error('Failed to update recommendation status');
    }
  }
};