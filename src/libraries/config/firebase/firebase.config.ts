import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { ConfigService } from '@nestjs/config';

export const setupFirebase = (_app, config: ConfigService) => {
  /**
   * Firebase Admin
   * https://firebase.google.com/docs/admin/setup
   */
  const serviceAccount = JSON.parse(config.get<string>('APP_FIREBASE_JSON'));
  const apiKey = config.get<string>('APP_FIREBASE_API_KEY');
  const authDomain = config.get<string>('APP_FIREBASE_AUTH_DOMAIN');
  const databaseURL = config.get<string>('APP_FIREBASE_DATABASE_URL');
  const projectId = config.get<string>('APP_FIREBASE_PROJECT_ID');
  const storageBucket = config.get<string>('APP_FIREBASE_STORAGE_BUCKET');
  const messagingSenderId = config.get<string>(
    'APP_FIREBASE_MESSAGING_SENDER_ID',
  );
  const appId = config.get<string>('APP_FIREBASE_APP_ID');
  const measurementId = config.get<string>('APP_FIREBASE_MEASUREMENT_ID');

  const firebaseConfig = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    credential: credential.cert(serviceAccount),
  };

  initializeApp(firebaseConfig);
};
