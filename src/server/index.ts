import express from 'express';
import cors from 'cors';
import { handleLinkedInAuth, signIn, signUp } from './auth';
import { initializeDB } from './db';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
initializeDB().catch(console.error);

app.post('/api/auth/linkedin', async (req, res) => {
  try {
    const { code } = req.body;
    const result = await handleLinkedInAuth(code);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: 'LinkedIn authentication failed' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await signIn(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await signUp(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Email already registered' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});