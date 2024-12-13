export interface Reference {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
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
  rating: number;
  skills: Array<{ name: string; type: 'soft' | 'hard' }>;
  createdAt: string;
  updatedAt: string;
}