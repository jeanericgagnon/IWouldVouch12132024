import axios from 'axios';
import { auth } from './firebase';
import { signInWithCustomToken } from 'firebase/auth';
import queryString from 'query-string';

const LINKEDIN_CLIENT_ID = '869avn9uidimse';
const LINKEDIN_REDIRECT_URI = `${window.location.origin}/auth/linkedin/callback`;
// Update scopes to match what's approved in LinkedIn app
const LINKEDIN_SCOPE = 'openid profile email w_member_social';

export const linkedInAuth = {
  initiateAuth: () => {
    try {
      console.log('Initiating LinkedIn auth...');
      const state = crypto.randomUUID();
      sessionStorage.setItem('linkedinState', state);

      const params = {
        response_type: 'code',
        client_id: LINKEDIN_CLIENT_ID,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        scope: LINKEDIN_SCOPE,
        state,
      };

      console.log('LinkedIn auth params:', params);
      const url = `https://www.linkedin.com/oauth/v2/authorization?${queryString.stringify(params)}`;
      console.log('Redirecting to:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Error initiating LinkedIn auth:', error);
      throw error;
    }
  },

  handleCallback: async (code: string) => {
    try {
      console.log('Handling LinkedIn callback with code:', code);

      // Call Netlify function to handle LinkedIn auth
      const response = await axios.post('/.netlify/functions/linkedinAuth', {
        code,
        redirectUri: LINKEDIN_REDIRECT_URI
      });

      console.log('LinkedIn auth response:', response.data);

      if (!response.data || !response.data.customToken) {
        console.error('Invalid auth response:', response.data);
        throw new Error('Invalid response from auth server');
      }

      const { customToken, isNewUser, profile } = response.data;

      // Sign in with Firebase custom token
      await signInWithCustomToken(auth, customToken);

      return {
        isNewUser: !!isNewUser,
        email: profile.email,
        name: profile.name,
        requiresPassword: isNewUser
      };
    } catch (error) {
      console.error('LinkedIn auth error:', error.response?.data || error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to authenticate with LinkedIn'
      );
    }
  }
};