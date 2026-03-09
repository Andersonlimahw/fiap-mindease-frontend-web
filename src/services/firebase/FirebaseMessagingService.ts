import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { app, db, getMessagingInstance } from '../../config/firebase';

// Keep the app import side-effect-free; it is only needed for getToken internals.
void app;

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

/** The FCM registration token currently held in memory. */
let currentToken: string | null = null;

/** Cleanup function returned by onMessage; stored so we can unsubscribe. */
let foregroundUnsubscribe: (() => void) | null = null;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns the Firestore subcollection that stores FCM tokens for a user. */
const getUserTokensCollection = (userId: string) =>
    collection(db, 'users', userId, 'fcmTokens');

// ---------------------------------------------------------------------------
// Public service object
// ---------------------------------------------------------------------------

export const FirebaseMessagingService = {
    /**
     * Full initialisation flow:
     * 1. Request notification permission from the browser.
     * 2. Obtain an FCM registration token.
     * 3. Persist the token in Firestore under `users/{userId}/fcmTokens/{token}`.
     * 4. Start the foreground message listener.
     *
     * Safe to call in environments that do not support the Notifications API –
     * the method returns early without throwing.
     */
    init: async (userId: string): Promise<void> => {
        console.log('FirebaseMessagingService: Initialising for user', userId);

        const messaging = await getMessagingInstance();
        if (!messaging) {
            console.warn('FirebaseMessagingService: Messaging is not supported in this environment – skipping init.');
            return;
        }

        const permission = await FirebaseMessagingService.requestPermission();
        if (permission !== 'granted') {
            console.warn('FirebaseMessagingService: Notification permission not granted:', permission);
            return;
        }

        const token = await FirebaseMessagingService.getToken();
        if (!token) {
            console.warn('FirebaseMessagingService: Could not obtain FCM token.');
            return;
        }

        await FirebaseMessagingService.saveTokenToFirestore(userId, token);

        foregroundUnsubscribe = FirebaseMessagingService.setupForegroundListener();

        console.log('FirebaseMessagingService: Initialisation complete.');
    },

    /**
     * Cleanup:
     * 1. Remove the current token from Firestore.
     * 2. Unsubscribe the foreground listener.
     * 3. Clear in-memory state.
     */
    cleanup: async (userId: string): Promise<void> => {
        console.log('FirebaseMessagingService: Cleaning up for user', userId);

        if (foregroundUnsubscribe) {
            foregroundUnsubscribe();
            foregroundUnsubscribe = null;
        }

        if (currentToken) {
            await FirebaseMessagingService.removeTokenFromFirestore(userId, currentToken);
            currentToken = null;
        }

        console.log('FirebaseMessagingService: Cleanup complete.');
    },

    /**
     * Request the browser notification permission.
     * Returns the resulting `NotificationPermission` value.
     */
    requestPermission: async (): Promise<NotificationPermission> => {
        console.log('FirebaseMessagingService: Requesting notification permission.');

        if (!('Notification' in window)) {
            console.warn('FirebaseMessagingService: Notification API not available.');
            return 'denied';
        }

        const permission = await Notification.requestPermission();
        console.log('FirebaseMessagingService: Permission result:', permission);
        return permission;
    },

    /**
     * Obtain the FCM registration token for the current device/browser.
     * Requires `VITE_FIREBASE_VAPID_KEY` to be set.
     * Returns `null` when messaging is unsupported or the token cannot be retrieved.
     */
    getToken: async (): Promise<string | null> => {
        const supported = await isSupported().catch(() => false);
        if (!supported) {
            console.warn('FirebaseMessagingService: Messaging not supported – cannot get token.');
            return null;
        }

        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
        if (!vapidKey) {
            console.warn('FirebaseMessagingService: VITE_FIREBASE_VAPID_KEY is not defined – cannot get FCM token.');
            return null;
        }

        const messaging = await getMessagingInstance();
        if (!messaging) {
            return null;
        }

        try {
            const token = await getToken(messaging, { vapidKey });
            currentToken = token;
            console.log('FirebaseMessagingService: FCM token obtained.');
            return token;
        } catch (error) {
            console.error('FirebaseMessagingService: Error obtaining FCM token:', error);
            return null;
        }
    },

    /**
     * Persist the FCM token in Firestore at:
     *   `users/{userId}/fcmTokens/{token}`
     *
     * Document fields: `token`, `createdAt`, `platform`.
     */
    saveTokenToFirestore: async (userId: string, token: string): Promise<void> => {
        try {
            console.log(`FirebaseMessagingService: Saving token to users/${userId}/fcmTokens/${token}`);
            const tokenRef = doc(getUserTokensCollection(userId), token);
            await setDoc(tokenRef, {
                token,
                createdAt: new Date().toISOString(),
                platform: 'web',
            });
            console.log('FirebaseMessagingService: Token saved to Firestore.');
        } catch (error) {
            console.error('FirebaseMessagingService: Error saving token to Firestore:', error);
            throw error;
        }
    },

    /**
     * Delete the FCM token document from Firestore at:
     *   `users/{userId}/fcmTokens/{token}`
     */
    removeTokenFromFirestore: async (userId: string, token: string): Promise<void> => {
        try {
            console.log(`FirebaseMessagingService: Removing token from users/${userId}/fcmTokens/${token}`);
            const tokenRef = doc(getUserTokensCollection(userId), token);
            await deleteDoc(tokenRef);
            console.log('FirebaseMessagingService: Token removed from Firestore.');
        } catch (error) {
            console.error('FirebaseMessagingService: Error removing token from Firestore:', error);
            throw error;
        }
    },

    /**
     * Register a foreground message listener using Firebase `onMessage`.
     * When a push arrives while the tab is in the foreground, a toast is shown
     * via Sonner.
     *
     * Returns the unsubscribe function so callers can tear it down.
     */
    setupForegroundListener: (): (() => void) => {
        console.log('FirebaseMessagingService: Setting up foreground message listener.');

        // Resolve messaging synchronously from cache; if not yet resolved, the
        // listener is a no-op until getMessagingInstance resolves.
        let unsubscribe: (() => void) = () => { /* no-op until messaging resolves */ };

        getMessagingInstance().then((messaging) => {
            if (!messaging) {
                console.warn('FirebaseMessagingService: Messaging not supported – foreground listener not registered.');
                return;
            }

            unsubscribe = onMessage(messaging, (payload) => {
                console.log('FirebaseMessagingService: Foreground message received:', payload);

                const title = payload.notification?.title ?? 'MindEase';
                const body = payload.notification?.body ?? '';

                toast(title, {
                    description: body,
                });
            });

            console.log('FirebaseMessagingService: Foreground listener registered.');
        });

        // Return a stable reference that delegates to whatever unsubscribe was set.
        return () => unsubscribe();
    },

    /**
     * Return the FCM token currently held in memory (set after a successful
     * `getToken` call). May be `null` if `init` has not been called yet or
     * if the environment does not support messaging.
     */
    getCurrentToken: (): string | null => currentToken,
};
