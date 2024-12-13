import { db } from './config';
import { collection, addDoc, getDocs, query, limit, deleteDoc } from 'firebase/firestore';

export async function testFirebaseConnection() {
  try {
    // Test collection name
    const TEST_COLLECTION = 'connection_test';
    
    // 1. Try to write a document
    console.log('Testing Firebase connection...');
    const testDoc = await addDoc(collection(db, TEST_COLLECTION), {
      timestamp: new Date(),
      test: true
    });
    console.log('✓ Write test successful');

    // 2. Try to read the document back
    const q = query(collection(db, TEST_COLLECTION), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('✓ Read test successful');
      
      // 3. Clean up test document
      await deleteDoc(testDoc);
      console.log('✓ Cleanup successful');
      
      console.log('Firebase connection test completed successfully! ✨');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
}