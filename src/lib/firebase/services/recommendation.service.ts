import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config';
import { RECOMMENDATIONS } from '../collections';
import type { FirestoreRecommendation } from '../collections';
import { convertFirestoreData } from '../utils';

const BATCH_SIZE = 10;

export const recommendationService = {
  /**
   * Create a new recommendation
   */
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

  /**
   * Get a single recommendation by ID
   */
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

  /**
   * Get recommendations for a user with pagination
   */
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

  /**
   * Update recommendation status
   */
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
  },

  /**
   * Delete a pending recommendation
   */
  async deleteRecommendation(id: string): Promise<void> {
    try {
      const docRef = doc(db, RECOMMENDATIONS, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Recommendation not found');
      }

      if (docSnap.data().status !== 'pending') {
        throw new Error('Only pending recommendations can be deleted');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      throw new Error('Failed to delete recommendation');
    }
  }
};