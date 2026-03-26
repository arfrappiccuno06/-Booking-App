// firebase configuration and initialization
// this file connects the app to firebase realtime database

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// firebase project credentials from environment variables
// these are loaded from the .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN_HERE",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "YOUR_DATABASE_URL_HERE",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID_HERE",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID_HERE"
};

// initialize firebase app with the config
const app = initializeApp(firebaseConfig);

// create database instance for storing bookings and availability
export const database = getDatabase(app);

// create auth instance (not currently used but available for future)
export const auth = getAuth(app);

export default app;
