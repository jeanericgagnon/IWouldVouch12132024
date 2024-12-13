import { userService, recommendationService } from '../lib/firebase/services/firebase.service';
import { mockUserService, mockRecommendationService } from '../lib/firebase/services/mock.service';

// Use mock services in StackBlitz environment
const isStackBlitz = import.meta.env.VITE_PLATFORM === 'stackblitz';

export const userApi = isStackBlitz ? mockUserService : userService;
export const recommendationApi = isStackBlitz ? mockRecommendationService : recommendationService;

export const api = {
  users: userApi,
  recommendations: recommendationApi
};