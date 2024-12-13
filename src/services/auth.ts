import { mockStore } from '../data/mockData';
import { toast } from 'react-hot-toast';

export const authService = {
  async signInWithEmail(email: string, password: string) {
    try {
      // Find user in mock data
      const user = mockStore.getUserByEmailAndPassword(email, password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Store auth info in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token');

      return user;
    } catch (error) {
      console.error('Email auth error:', error);
      throw error;
    }
  },

  async signOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }
};