import { Handler } from '@netlify/functions';
import axios from 'axios';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const LINKEDIN_CLIENT_ID = '869avn9uidimse';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { code, redirectUri } = JSON.parse(event.body || '{}');

    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: redirectUri
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user profile using v2 API
    const [profileResponse, emailResponse] = await Promise.all([
      axios.get('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    ]);

    const email = emailResponse.data.elements[0]['handle~'].emailAddress;
    const profile = {
      linkedinId: profileResponse.data.id,
      email,
      name: `${profileResponse.data.localizedFirstName} ${profileResponse.data.localizedLastName}`,
      firstName: profileResponse.data.localizedFirstName,
      lastName: profileResponse.data.localizedLastName,
      avatar: profileResponse.data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier
    };

    // Check if user exists
    let userRecord;
    let isNewUser = false;

    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      // User doesn't exist, create new user
      userRecord = await admin.auth().createUser({
        email,
        displayName: profile.name,
        photoURL: profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      });
      isNewUser = true;

      // Create user document in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email,
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: profile.avatar,
        linkedin: {
          id: profile.linkedinId,
          profileUrl: `https://www.linkedin.com/in/${profile.linkedinId}`,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Create custom token
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        customToken, 
        isNewUser,
        profile
      })
    };
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message 
      })
    };
  }
};