import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { accessToken } = JSON.parse(event.body || '{}');

    if (!accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Access token is required' })
      };
    }

    // Get LinkedIn profile URL
    const response = await axios.get('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const profileId = response.data.id;
    const profileResponse = await axios.get(`https://api.linkedin.com/v2/people/${profileId}?projection=(vanityName)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const handle = profileResponse.data.vanityName;

    return {
      statusCode: 200,
      body: JSON.stringify({ handle })
    };
  } catch (error) {
    console.error('Error getting LinkedIn handle:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get LinkedIn handle' })
    };
  }
}