import { collection } from 'firebase/firestore';
import { db } from './config';

// Collection references
export const USERS = 'users';
export const RECOMMENDATIONS = 'recommendations';

// Collection interfaces
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  bio?: string;
  linkedin?: string;
  skills: Array<{
    name: string;
    type: 'soft' | 'hard';
  }>;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface FirestoreRecommendation {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    linkedin?: string;
  };
  recipient: {
    id: string;
    name: string;
  };
  relationship: {
    type: string;
    company: string;
    duration: string;
  };
  endorsement: string;
  skills: Array<{
    name: string;
    type: 'soft' | 'hard';
  }>;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  additionalSections?: Array<{
    title: string;
    content: string;
  }>;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// Collection references with types
export const usersCollection = collection(db, USERS);
export const recommendationsCollection = collection(db, RECOMMENDATIONS);