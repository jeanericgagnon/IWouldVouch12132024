import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0TU1Y7aDwS0_c0j1gSAV-a1xFYBkwVPM",
  authDomain: "iwouldvouch-8b1a3.firebaseapp.com",
  projectId: "iwouldvouch-8b1a3",
  storageBucket: "iwouldvouch-8b1a3.firebasestorage.app",
  messagingSenderId: "947947431076",
  appId: "1:947947431076:web:fc0d5e5188a5bdb69d7231",
  measurementId: "G-EXTLLR9Y55"
};

async function initializeFirestore() {
  try {
    console.log('Initializing Firestore...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Create demo users
    const users = [
      {
        id: "demo-user-1",
        name: "John Doe",
        email: "john@example.com",
        title: "Software Engineer",
        bio: "Experienced software engineer with a passion for building great products",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        skills: [
          { name: "JavaScript", type: "hard" },
          { name: "React", type: "hard" },
          { name: "Leadership", type: "soft" }
        ],
        recommendationIds: []
      },
      {
        id: "demo-user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        title: "Product Manager",
        bio: "Product manager focused on user-centric solutions",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        skills: [
          { name: "Product Strategy", type: "hard" },
          { name: "Agile", type: "hard" },
          { name: "Communication", type: "soft" }
        ],
        recommendationIds: []
      }
    ];

    // Create users in Firestore
    for (const user of users) {
      await setDoc(doc(db, 'users', user.id), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    console.log('Firestore initialization completed successfully! ✨');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
}

// Run initialization
initializeFirestore();