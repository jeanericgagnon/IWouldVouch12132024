import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { User } from '../types/user';
import { Recommendation } from '../types/recommendation';

const firebaseConfig = {
  apiKey: "AIzaSyCsRKLOh5S9YMH1tvn1Ilz8bD0mTWrOOtw",
  authDomain: "iwouldvouch.firebaseapp.com",
  projectId: "iwouldvouch",
  storageBucket: "iwouldvouch.firebasestorage.app",
  messagingSenderId: "533592845850",
  appId: "1:533592845850:web:47badf24cbff000b94aba3",
  measurementId: "G-FNQLEKREMR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// User Service
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
      ...userSnap.data()
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

// Recommendation Service
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
      ...recommendationSnap.data()
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
      ...doc.data()
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

// Helper function to convert Firestore Timestamps to ISO strings
export const convertTimestamps = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }

  return Object.keys(obj).reduce((result: any, key) => {
    result[key] = convertTimestamps(obj[key]);
    return result;
  }, {});
};