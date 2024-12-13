import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB0TU1Y7aDwS0_c0j1gSAV-a1xFYBkwVPM",
  authDomain: "iwouldvouch-8b1a3.firebaseapp.com",
  projectId: "iwouldvouch-8b1a3",
  storageBucket: "iwouldvouch-8b1a3.firebasestorage.app",
  messagingSenderId: "947947431076",
  appId: "1:947947431076:web:fc0d5e5188a5bdb69d7231",
  measurementId: "G-EXTLLR9Y55"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  console.log('Initializing Firebase app...');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Using existing Firebase app');
  app = getApps()[0];
}

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable Firestore offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
}

// Use emulators in development
if (import.meta.env.DEV) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.warn('Failed to connect to Firebase emulators:', error);
  }
}

// Test Firestore connection
const testFirestore = async () => {
  try {
    console.log('Testing Firestore connection...');
    const testCollection = db.collection('_test_connection');
    const testDoc = await testCollection.add({
      timestamp: new Date(),
      test: true
    });
    await testDoc.delete();
    console.log('✅ Firestore connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return false;
  }
};

// Export initialized app and connection test
export { app, testFirestore };