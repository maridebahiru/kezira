import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1tyUW36RgbJvU0s4a7ZH75Qb5BBwKEBw",
  authDomain: "events-4f122.firebaseapp.com",
  projectId: "events-4f122",
  storageBucket: "events-4f122.firebasestorage.app",
  messagingSenderId: "49374448349",
  appId: "1:49374448349:web:991b003ece5e5e84f36934",
  measurementId: "G-4B5G87HKR7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let appCheckInstance: any = null;

if (typeof window !== 'undefined') {
  try {
    // Enable custom debug token only if explicitly specified in environment
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
    }
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LftDbgtAAAAACnb-gwzP0DEaqvBWVlpq-z7LyDj'),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    // App Check failover silently handled
  }
}

export const appCheck = appCheckInstance;

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
