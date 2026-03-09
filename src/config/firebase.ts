/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Messaging is lazily resolved because isSupported() is async.
// Use getMessagingInstance() instead of importing messaging directly.
let _messaging: Messaging | null = null;
let _messagingPromise: Promise<Messaging | null> | null = null;

/**
 * Returns the Firebase Messaging instance if supported by the current environment,
 * or null if not supported (e.g. Safari without HTTPS, test environments).
 * The result is cached after the first call.
 */
const getMessagingInstance = (): Promise<Messaging | null> => {
    if (_messagingPromise) return _messagingPromise;

    _messagingPromise = isSupported()
        .then((supported) => {
            if (supported) {
                _messaging = getMessaging(app);
                return _messaging;
            }
            return null;
        })
        .catch(() => null);

    return _messagingPromise;
};

export { app, auth, db, getMessagingInstance };
