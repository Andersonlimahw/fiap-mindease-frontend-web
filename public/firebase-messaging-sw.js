// firebase-messaging-sw.js
// IMPORTANT: This file must be in the public/ folder so Vite serves it at the
// root path (/firebase-messaging-sw.js), which is required for the service worker
// scope to cover the whole origin.
//
// Firebase configuration for the service worker is read from self.FIREBASE_CONFIG
// when available (injected at runtime), or falls back to empty strings.
// In production you can call messaging.useServiceWorker() with a custom
// ServiceWorkerRegistration to pass config down, or use a build-time injection
// strategy (e.g. vite-plugin-pwa).

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: self.FIREBASE_CONFIG?.apiKey || '',
  authDomain: self.FIREBASE_CONFIG?.authDomain || '',
  projectId: self.FIREBASE_CONFIG?.projectId || '',
  storageBucket: self.FIREBASE_CONFIG?.storageBucket || '',
  messagingSenderId: self.FIREBASE_CONFIG?.messagingSenderId || '',
  appId: self.FIREBASE_CONFIG?.appId || '',
});

const messaging = firebase.messaging();

/**
 * Handle push messages received while the app is in the background or closed.
 * The notification is displayed using the native showNotification API so the
 * browser renders it even when no tab is open.
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'MindEase';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Handle notification click: close the notification and navigate to the app root.
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
