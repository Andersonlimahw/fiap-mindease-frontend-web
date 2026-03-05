import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(() => ({ id: 'mock-doc-id' })),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()), // Return an unsubscribe function
}));

// Mock MindEase Services to prevent subscription errors
vi.mock('../services/firebase/FirebaseUserRepository', () => ({
  FirebaseUserRepository: {
    loadPreferences: vi.fn(),
    savePreferences: vi.fn(),
    setupStoreSubscriptions: vi.fn(() => vi.fn()),
  }
}));

vi.mock('../services/firebase/FirebaseChatRepository', () => ({
  FirebaseChatRepository: {
    loadHistory: vi.fn(),
    addMessage: vi.fn(),
    clearHistory: vi.fn(),
  }
}));

// Mock crypto for UUIDs in Node
if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
    Object.defineProperty(global, 'crypto', {
        value: {
            randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 9)
        },
        configurable: true
    });
}
