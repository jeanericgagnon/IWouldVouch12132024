import { initializeApp } from 'firebase/app';
import { getFirestore, collection, deleteDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsRKLOh5S9YMH1tvn1Ilz8bD0mTWrOOtw",
  authDomain: "iwouldvouch.firebaseapp.com",
  projectId: "iwouldvouch",
  storageBucket: "iwouldvouch.appspot.com",
  messagingSenderId: "533592845850",
  appId: "1:533592845850:web:47badf24cbff000b94aba3",
  measurementId: "G-FNQLEKREMR"
};

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Delete all documents in users collection
    console.log('Cleaning users collection...');
    const usersRef = collection(db, 'users');
    const userDocs = await getDocs(usersRef);
    for (const doc of userDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log('Users collection cleaned');

    // Delete all documents in recommendations collection
    console.log('Cleaning recommendations collection...');
    const recommendationsRef = collection(db, 'recommendations');
    const recommendationDocs = await getDocs(recommendationsRef);
    for (const doc of recommendationDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log('Recommendations collection cleaned');

    // Create demo users
    console.log('Creating demo users...');
    const demoUsers = [
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
        ]
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
        ]
      }
    ];

    // Create users in Firestore
    for (const user of demoUsers) {
      const { id, ...userData } = user;
      await setDoc(doc(db, 'users', id), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Created user: ${id}`);
    }
    console.log('Demo users created');

    // Create sample recommendations
    console.log('Creating sample recommendations...');
    const sampleRecommendations = [
      {
        author: {
          id: "999",
          name: "Demo User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
          title: "Software Engineer",
          linkedin: "https://linkedin.com/in/demo-user"
        },
        recipient: {
          id: "888",
          name: "Jane Smith"
        },
        relationship: {
          type: "colleague",
          company: "TechCorp",
          duration: "2-5"
        },
        endorsement: "Jane is an exceptional product manager who consistently delivers outstanding results. Her ability to balance stakeholder needs while maintaining a clear product vision is remarkable. She led our team through several critical launches, always ensuring clear communication and alignment across departments.",
        skills: [
          { name: "Leadership", type: "soft" },
          { name: "Product Strategy", type: "hard" },
          { name: "Stakeholder Management", type: "soft" }
        ],
        status: "approved",
        rating: 5
      }
    ];

    // Add sample recommendations
    for (const recommendation of sampleRecommendations) {
      await setDoc(doc(collection(db, 'recommendations')), {
        ...recommendation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('Sample recommendations created');

    console.log('Database cleanup and initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupDatabase();