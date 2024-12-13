import type { FirestoreUser, FirestoreRecommendation } from '../lib/firebase/collections';

// Mock users
export const mockUsers: FirestoreUser[] = [
  {
    id: "user1",
    email: "sarah.tech@example.com",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    title: "Senior Software Engineer",
    bio: "Full-stack developer with 8 years of experience building scalable web applications",
    location: "San Francisco, CA",
    currentCompany: "TechCorp",
    linkedin: "https://linkedin.com/in/sarahchen",
    skills: [
      { name: "JavaScript", type: "hard" },
      { name: "React", type: "hard" },
      { name: "Node.js", type: "hard" },
      { name: "Leadership", type: "soft" },
      { name: "Problem Solving", type: "soft" }
    ],
    availability: {
      status: 'open',
      isAvailable: true,
      positionsInterestedIn: ['Tech Lead', 'Engineering Manager'],
      workStyles: ['hybrid', 'remote']
    },
    showEmail: true,
    showLocation: true,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  },
  {
    id: "user2",
    email: "michael.product@example.com",
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    title: "Product Manager",
    bio: "Product leader focused on building user-centric solutions that drive business growth",
    location: "New York, NY",
    currentCompany: "InnovateNow",
    linkedin: "https://linkedin.com/in/mrodriguez",
    skills: [
      { name: "Product Strategy", type: "hard" },
      { name: "Agile", type: "hard" },
      { name: "User Research", type: "hard" },
      { name: "Communication", type: "soft" },
      { name: "Team Leadership", type: "soft" }
    ],
    availability: {
      status: 'not-looking',
      isAvailable: false
    },
    showEmail: false,
    showLocation: true,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  }
];

// Mock recommendations
export const mockRecommendations: FirestoreRecommendation[] = [
  {
    id: "rec1",
    author: {
      id: "user2",
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      title: "Product Manager",
      linkedin: "https://linkedin.com/in/mrodriguez"
    },
    recipient: {
      id: "user1",
      name: "Sarah Chen"
    },
    relationship: {
      type: "manager",
      company: "TechCorp",
      duration: "2-5"
    },
    endorsement: "Sarah is an exceptional software engineer who consistently delivers outstanding results. Her technical expertise in React and Node.js is matched by her ability to mentor junior developers and lead complex projects. She played a crucial role in redesigning our core platform, improving performance by 40% and reducing customer complaints by 60%.",
    skills: [
      { name: "JavaScript", type: "hard" },
      { name: "React", type: "hard" },
      { name: "Leadership", type: "soft" }
    ],
    status: "approved",
    rating: 5,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  },
  {
    id: "rec2",
    author: {
      id: "user3",
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      title: "Senior UX Designer",
      linkedin: "https://linkedin.com/in/alicejohnson"
    },
    recipient: {
      id: "user1",
      name: "Sarah Chen"
    },
    relationship: {
      type: "colleague",
      company: "TechCorp",
      duration: "1-2"
    },
    endorsement: "Working with Sarah has been an incredible experience. Her collaborative approach and technical skills make her an invaluable team member. She's particularly skilled at bridging the gap between design and development teams.",
    skills: [
      { name: "Collaboration", type: "soft" },
      { name: "Problem Solving", type: "soft" },
      { name: "Node.js", type: "hard" }
    ],
    status: "pending",
    rating: 5,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  }
];

// Mock data store class
class MockDataStore {
  private users: Map<string, FirestoreUser>;
  private recommendations: Map<string, FirestoreRecommendation>;

  constructor() {
    this.users = new Map(mockUsers.map(user => [user.id, user]));
    this.recommendations = new Map(mockRecommendations.map(rec => [rec.id, rec]));
  }

  getUserByEmailAndPassword(email: string, password: string): FirestoreUser | null {
    const user = Array.from(this.users.values()).find(user => 
      user.email === email && password === 'password' // In a real app, passwords would be hashed
    );
    
    if (user) {
      // Don't return sensitive data
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as FirestoreUser;
    }
    return null;
  }

  getUser(id: string): FirestoreUser | null {
    return this.users.get(id) || null;
  }

  updateUser(id: string, updates: Partial<FirestoreUser>): void {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, {
        ...user,
        ...updates,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
      });
    }
  }

  getUserRecommendations(userId: string, status?: string): FirestoreRecommendation[] {
    return Array.from(this.recommendations.values()).filter(rec => 
      rec.recipient.id === userId && (!status || rec.status === status)
    );
  }

  createRecommendation(data: Omit<FirestoreRecommendation, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `rec${Date.now()}`;
    const recommendation: FirestoreRecommendation = {
      id,
      ...data,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
    };
    this.recommendations.set(id, recommendation);
    return id;
  }

  updateRecommendationStatus(id: string, status: 'approved' | 'rejected'): void {
    const recommendation = this.recommendations.get(id);
    if (recommendation) {
      this.recommendations.set(id, {
        ...recommendation,
        status,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
      });
    }
  }
}

export const mockStore = new MockDataStore();