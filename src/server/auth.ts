import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { getDB } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const LINKEDIN_CLIENT_SECRET = 'WPL_AP1.4a0ipdaNRj7zvelL.TA/STQ==';
const LINKEDIN_CLIENT_ID = '869avn9uidimse';

export async function handleLinkedInAuth(code: string) {
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/linkedin/callback`
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Get user email
    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const email = emailResponse.data.elements[0]['handle~'].emailAddress;
    const name = `${profileResponse.data.localizedFirstName} ${profileResponse.data.localizedLastName}`;
    const linkedinId = profileResponse.data.id;

    const db = await getDB();
    let user = await db.get('SELECT * FROM users WHERE linkedin_id = ? OR email = ?', [linkedinId, email]);

    if (!user) {
      const result = await db.run(
        'INSERT INTO users (email, linkedin_id, name) VALUES (?, ?, ?)',
        [email, linkedinId, name]
      );
      user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    return { token, email: user.email, name: user.name };
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    throw new Error('LinkedIn authentication failed');
  }
}

export async function signIn(email: string, password: string) {
  const db = await getDB();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  return { token, email: user.email, name: user.name };
}

export async function signUp(email: string, password: string) {
  const db = await getDB();
  const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  );

  const user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

  return { token, email: user.email };
}