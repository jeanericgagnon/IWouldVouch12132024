import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types/user';
import { Recommendation } from '../types/recommendation';
import { convertFirestoreData } from '../lib/firebase/utils';

export const userService = {
  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  async getUser(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...convertFirestoreData(userSnap.data())
    } as User;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

export const recommendationService = {
  async createRecommendation(data: Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const recommendationsRef = collection(db, 'recommendations');
    const newRecommendationRef = doc(recommendationsRef);
    
    await setDoc(newRecommendationRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return newRecommendationRef.id;
  },

  async getRecommendation(recommendationId: string): Promise<Recommendation | null> {
    const recommendationRef = doc(db, 'recommendations', recommendationId);
    const recommendationSnap = await getDoc(recommendationRef);
    
    if (!recommendationSnap.exists()) {
      return null;
    }

    return {
      id: recommendationSnap.id,
      ...convertFirestoreData(recommendationSnap.data())
    } as Recommendation;
  },

  async getUserRecommendations(userId: string): Promise<Recommendation[]> {
    const q = query(
      collection(db, 'recommendations'),
      where('recipient.id', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertFirestoreData(doc.data())
    })) as Recommendation[];
  },

  async updateRecommendationStatus(
    recommendationId: string, 
    status: 'approved' | 'rejected'
  ): Promise<void> {
    const recommendationRef = doc(db, 'recommendations', recommendationId);
    await updateDoc(recommendationRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }
};