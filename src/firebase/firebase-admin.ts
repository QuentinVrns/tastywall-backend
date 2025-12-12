import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
};

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  throw new Error(
    'Firebase credentials are missing. Please check your .env file for FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL',
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('🔥 Firebase Admin SDK initialized');
}

export { admin };
