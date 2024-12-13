import type { FirestoreUser, FirestoreRecommendation } from '../firebase/collections';

// Mock users
export const mockUsers: FirestoreUser[] = [
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
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
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
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  }
];

// Mock recommendations
export const mockRecommendations: FirestoreRecommendation[] = [
  {
    id: "rec1",
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
    rating: 5,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  },
  {
    id: "rec2",
    author: {
      id: "888",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      title: "Product Manager",
      linkedin: "https://linkedin.com/in/janesmith"
    },
    recipient: {
      id: "999",
      name: "Demo User"
    },
    relationship: {
      type: "manager",
      company: "TechCorp",
      duration: "1-2"
    },
    endorsement: "Demo is a highly skilled software engineer with exceptional problem-solving abilities. Their technical expertise in React and TypeScript has been invaluable to our team. They consistently deliver high-quality code and are always willing to help others.",
    skills: [
      { name: "JavaScript", type: "hard" },
      { name: "React", type: "hard" },
      { name: "Teamwork", type: "soft" }
    ],
    status: "pending",
    rating: 5,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
  }
];

// Mock data store
class MockDataStore {
  private users: Map<string, FirestoreUser>;
  private recommendations: Map<string, FirestoreRecommendation>;

  constructor() {
    this.users = new Map(mockUsers.map(user => [user.id, user]));
    this.recommendations = new Map(mockRecommendations.map(rec => [rec.id, rec]));
  }

  // User methods
  getUser(id: string): FirestoreUser | null {
    return this.users.get(id) || null;
  }

  createUser(id: string, data: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): void {
    const timestamp = { seconds: Date.now() / 1000, nanoseconds: 0 };
    this.users.set(id, {
      id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  updateUser(id: string, data: Partial<FirestoreUser>): void {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, {
        ...user,
        ...data,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
      });
    }
  }

  // Recommendation methods
  getRecommendation(id: string): FirestoreRecommendation | null {
    return this.recommendations.get(id) || null;
  }

  getUserRecommendations(userId: string, status?: string): FirestoreRecommendation[] {
    return Array.from(this.recommendations.values()).filter(rec => 
      rec.recipient.id === userId && (!status || rec.status === status)
    );
  }

  createRecommendation(data: Omit<FirestoreRecommendation, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `rec${Date.now()}`;
    const timestamp = { seconds: Date.now() / 1000, nanoseconds: 0 };
    const recommendation: FirestoreRecommendation = {
      id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
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