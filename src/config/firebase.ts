import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCut7yRPqGnqY70lHvvweUAzrfbhxJ0N6k',
  authDomain: 'lastlove-9cc80.firebaseapp.com',
  projectId: 'lastlove-9cc80',
  storageBucket: 'gs://lastlove-9cc80.appspot.com',
  messagingSenderId: '376795470678',
  appId: '1:376795470678:android:0c2c6d7fed65a6d1e6d4f7',
};
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
