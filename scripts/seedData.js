import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "iwouldvouch-8b1a3",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = getFirestore(app);

const mockUsers = [
  {
    id: 'user1',
    email: 'sarah.tech@example.com',
    name: 'Sarah Chen',
    firstName: 'Sarah',
    lastName: 'Chen',
    title: 'Senior Software Engineer',
    bio: 'Full-stack developer with 8 years of experience building scalable web applications',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    linkedin: {
      id: 'sarahchen123',
      profileUrl: 'https://linkedin.com/in/sarahchen',
      headline: 'Senior Software Engineer | Full Stack Developer',
      industry: 'Computer Software'
    },
    skills: [
      { name: 'JavaScript', type: 'hard', endorsements: 15 },
      { name: 'React', type: 'hard', endorsements: 12 },
      { name: 'Node.js', type: 'hard', endorsements: 10 },
      { name: 'Leadership', type: 'soft', endorsements: 8 },
      { name: 'Problem Solving', type: 'soft', endorsements: 7 }
    ],
    availability: {
      status: 'open',
      isAvailable: true,
      positionsInterestedIn: ['Tech Lead', 'Engineering Manager'],
      workStyles: ['hybrid', 'remote']
    }
  },
  {
    id: 'user2',
    email: 'michael.product@example.com',
    name: 'Michael Rodriguez',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    title: 'Product Manager',
    bio: 'Product leader focused on building user-centric solutions that drive business growth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    linkedin: {
      id: 'mrodriguez456',
      profileUrl: 'https://linkedin.com/in/mrodriguez',
      headline: 'Senior Product Manager | Tech Enthusiast',
      industry: 'Product Management'
    },
    skills: [
      { name: 'Product Strategy', type: 'hard', endorsements: 20 },
      { name: 'Agile', type: 'hard', endorsements: 18 },
      { name: 'User Research', type: 'hard', endorsements: 15 },
      { name: 'Communication', type: 'soft', endorsements: 12 },
      { name: 'Team Leadership', type: 'soft', endorsements: 10 }
    ],
    availability: {
      status: 'not-looking',
      isAvailable: false
    }
  }
];

const mockRecommendations = [
  {
    id: 'rec1',
    author: {
      id: 'user2',
      name: 'Michael Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      title: 'Product Manager',
      linkedin: 'https://linkedin.com/in/mrodriguez'
    },
    recipient: {
      id: 'user1',
      name: 'Sarah Chen'
    },
    relationship: {
      type: 'manager',
      company: 'TechCorp',
      duration: '2-5'
    },
    endorsement: `Sarah is an exceptional software engineer who consistently delivers outstanding results. Her technical expertise in React and Node.js is matched by her ability to mentor junior developers and lead complex projects. She played a crucial role in redesigning our core platform, improving performance by 40% and reducing customer complaints by 60%. Sarah's problem-solving skills and attention to detail make her an invaluable team member.`,
    skills: [
      { name: 'JavaScript', type: 'hard' },
      { name: 'React', type: 'hard' },
      { name: 'Leadership', type: 'soft' }
    ],
    rating: 5,
    status: 'approved',
    additionalSections: [
      {
        title: 'Technical Leadership',
        content: 'Sarah led our migration to microservices architecture, training the team and establishing best practices.'
      },
      {
        title: 'Mentorship',
        content: 'She created and led our engineering mentorship program, helping 5 junior developers grow into mid-level roles.'
      }
    ]
  }
];

async function clearCollection(collectionName) {
  console.log(`Clearing ${collectionName} collection...`);
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Cleared ${snapshot.size} documents from ${collectionName}`);
}

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Clear existing data
    await clearCollection('users');
    await clearCollection('recommendations');

    // Seed users
    console.log('Seeding users...');
    const userBatch = db.batch();
    
    for (const user of mockUsers) {
      console.log(`Creating user: ${user.name}`);
      const userRef = db.collection('users').doc(user.id);
      userBatch.set(userRef, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await userBatch.commit();
    console.log('Users seeded successfully');

    // Seed recommendations
    console.log('Seeding recommendations...');
    const recBatch = db.batch();
    
    for (const rec of mockRecommendations) {
      console.log(`Creating recommendation from ${rec.author.name} to ${rec.recipient.name}`);
      const recRef = db.collection('recommendations').doc(rec.id);
      recBatch.set(recRef, {
        ...rec,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await recBatch.commit();
    console.log('Recommendations seeded successfully');

    console.log('Data seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run seeding
seedData();