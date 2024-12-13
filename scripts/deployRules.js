import { initializeApp, cert } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function deployRules() {
  try {
    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId: 'iwouldvouch-8b1a3',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });

    // Get Security Rules service
    const rules = getSecurityRules(app);

    // Read rules file
    const rulesPath = resolve(process.cwd(), 'firestore.rules');
    const rulesContent = readFileSync(rulesPath, 'utf8');

    // Deploy rules
    await rules.releaseSecurityRules({
      name: `projects/iwouldvouch-8b1a3/databases/(default)/documents`,
      rules: rulesContent
    });

    console.log('✅ Firestore rules deployed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deploying Firestore rules:', error);
    console.error(error);
    process.exit(1);
  }
}

deployRules();