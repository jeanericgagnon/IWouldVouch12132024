import { initializeApp } from 'firebase/app';
import { getFirestore, collection, deleteDoc, getDocs, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsRKLOh5S9YMH1tvn1Ilz8bD0mTWrOOtw",
  authDomain: "iwouldvouch.firebaseapp.com",
  projectId: "iwouldvouch",
  storageBucket: "iwouldvouch.firebasestorage.app",
  messagingSenderId: "533592845850",
  appId: "1:533592845850:web:47badf24cbff000b94aba3",
  measurementId: "G-FNQLEKREMR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupDatabase() {
  // Delete all documents in users collection
  const usersRef = collection(db, 'users');
  const userDocs = await getDocs(usersRef);
  for (const doc of userDocs.docs) {
    await deleteDoc(doc.ref);
  }

  // Delete all documents in references collection
  const referencesRef = collection(db, 'references');
  const refDocs = await getDocs(referencesRef);
  for (const doc of refDocs.docs) {
    await deleteDoc(doc.ref);
  }

  console.log('Database cleaned successfully');
}

async function initializeDatabase() {
  // Create demo users
  const users = [
    {
      id: "999",
      name: "Demo User",
      email: "demo@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
      title: "Software Engineer",
      bio: "Demo user account showcasing the platform features",
      linkedin: "https://linkedin.com/in/demo-user",
      skills: [
        { name: "JavaScript", type: "hard" },
        { name: "React", type: "hard" },
        { name: "TypeScript", type: "hard" },
        { name: "Leadership", type: "soft" },
        { name: "Communication", type: "soft" }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "888",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      title: "Product Manager",
      bio: "Experienced product manager focused on user-centric solutions",
      linkedin: "https://linkedin.com/in/janesmith",
      skills: [
        { name: "Product Strategy", type: "hard" },
        { name: "Agile", type: "hard" },
        { name: "Leadership", type: "soft" }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Create users in Firestore
  for (const user of users) {
    await setDoc(doc(db, 'users', user.id), user);
  }

  console.log('Database initialized with demo users');
}

async function main() {
  try {
    console.log('Starting database cleanup...');
    await cleanupDatabase();
    
    console.log('Starting database initialization...');
    await initializeDatabase();
    
    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database reset:', error);
    process.exit(1);
  }
}

main();