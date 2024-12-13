export interface LinkedInProfile {
  sub: string;           // LinkedIn ID
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture?: string;
  locale?: string;
  headline?: string;
  vanityName?: string;  // LinkedIn profile URL name
  industry?: string;
  location?: {
    country?: string;
    city?: string;
  };
  positions?: Array<{
    title: string;
    company: string;
    startDate?: string;
    endDate?: string;
    current: boolean;
  }>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  title?: string;
  location?: string;
  linkedin?: {
    id: string;
    profileUrl?: string;
    headline?: string;
    industry?: string;
    vanityName?: string;
    positions?: Array<{
      title: string;
      company: string;
      startDate?: string;
      endDate?: string;
      current: boolean;
    }>;
  };
  skills: Array<{
    name: string;
    type: 'soft' | 'hard';
    endorsements?: number;
  }>;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  showLocation?: boolean;
  showEmail?: boolean;
  availability?: {
    status: 'not-looking' | 'actively-looking' | 'open' | 'casually-looking';
    isAvailable: boolean;
    positionsInterestedIn?: string[];
    workStyles?: Array<'inPerson' | 'hybrid' | 'remote'>;
  };
}