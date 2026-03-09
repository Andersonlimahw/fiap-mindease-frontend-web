import { describe, it, expect, vi, beforeEach } from 'vitest';

// Must be hoisted before importing the service under test
vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(() => ({})),
  isSupported: vi.fn(() => Promise.resolve(false)),
  getToken: vi.fn(() => Promise.resolve('mock-fcm-token')),
  onMessage: vi.fn(() => vi.fn()),
  deleteToken: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn((...args: any[]) => ({ path: args.slice(1).join('/') })),
  doc: vi.fn((...args: any[]) => ({ id: args[args.length - 1], args })),
  setDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
}));

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

// Mock config/firebase — getMessagingInstance retorna null por padrão
vi.mock('../../config/firebase', () => ({
  app: {},
  db: { type: 'mock-db' },
  auth: { type: 'mock-auth' },
  getMessagingInstance: vi.fn(() => Promise.resolve(null)),
}));

import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { setDoc, deleteDoc, collection, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { getMessagingInstance } from '../../config/firebase';
import { FirebaseMessagingService } from './FirebaseMessagingService';

describe('FirebaseMessagingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Garante que getMessagingInstance volta ao padrão (null) após cada teste
    vi.mocked(getMessagingInstance).mockResolvedValue(null);
  });

  // ---------------------------------------------------------------------------
  // requestPermission
  // ---------------------------------------------------------------------------

  describe('requestPermission', () => {
    it('deve retornar "denied" se Notification não está disponível no window', async () => {
      const original = (window as any).Notification;
      delete (window as any).Notification;

      const result = await FirebaseMessagingService.requestPermission();

      expect(result).toBe('denied');

      (window as any).Notification = original;
    });

    it('deve chamar Notification.requestPermission e retornar o resultado', async () => {
      const requestPermissionMock = vi.fn(() => Promise.resolve('granted' as NotificationPermission));
      Object.defineProperty(window, 'Notification', {
        value: {
          permission: 'default',
          requestPermission: requestPermissionMock,
        },
        configurable: true,
        writable: true,
      });

      const result = await FirebaseMessagingService.requestPermission();

      expect(requestPermissionMock).toHaveBeenCalled();
      expect(result).toBe('granted');
    });
  });

  // ---------------------------------------------------------------------------
  // getToken
  // ---------------------------------------------------------------------------

  describe('getToken', () => {
    it('deve retornar null se messaging não está disponível (isSupported = false)', async () => {
      vi.mocked(isSupported).mockResolvedValueOnce(false);

      const result = await FirebaseMessagingService.getToken();

      expect(result).toBeNull();
    });

    it('deve retornar null se VAPID key não estiver definida', async () => {
      vi.mocked(isSupported).mockResolvedValueOnce(true);
      // VITE_FIREBASE_VAPID_KEY não está definida em ambiente de teste

      const result = await FirebaseMessagingService.getToken();

      expect(result).toBeNull();
      expect(getToken).not.toHaveBeenCalled();
    });

    it('deve retornar o token quando messaging está disponível e VAPID key definida', async () => {
      vi.mocked(isSupported).mockResolvedValueOnce(true);

      const mockMessagingObj = { type: 'mock-messaging' };
      vi.mocked(getMessagingInstance).mockResolvedValueOnce(mockMessagingObj as any);
      vi.mocked(getToken).mockResolvedValueOnce('real-fcm-token');

      // Usa vi.stubEnv para injetar a VAPID key
      vi.stubEnv('VITE_FIREBASE_VAPID_KEY', 'test-vapid-key');

      const result = await FirebaseMessagingService.getToken();

      vi.unstubAllEnvs();

      expect(getToken).toHaveBeenCalledWith(mockMessagingObj, { vapidKey: 'test-vapid-key' });
      expect(result).toBe('real-fcm-token');
    });

    it('deve retornar null se getToken lançar exceção', async () => {
      vi.mocked(isSupported).mockResolvedValueOnce(true);
      const mockMessagingObj = { type: 'mock-messaging' };
      vi.mocked(getMessagingInstance).mockResolvedValueOnce(mockMessagingObj as any);
      vi.mocked(getToken).mockRejectedValueOnce(new Error('token error'));

      vi.stubEnv('VITE_FIREBASE_VAPID_KEY', 'test-vapid-key');

      const result = await FirebaseMessagingService.getToken();

      vi.unstubAllEnvs();

      expect(result).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // saveTokenToFirestore
  // ---------------------------------------------------------------------------

  describe('saveTokenToFirestore', () => {
    it('deve chamar setDoc com os dados corretos', async () => {
      const userId = 'user-123';
      const token = 'fcm-token-abc';

      await FirebaseMessagingService.saveTokenToFirestore(userId, token);

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'fcmTokens');
      expect(doc).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          token,
          platform: 'web',
          createdAt: expect.any(String),
        })
      );
    });

    it('deve propagar erro se setDoc falhar', async () => {
      vi.mocked(setDoc).mockRejectedValueOnce(new Error('firestore error'));

      await expect(
        FirebaseMessagingService.saveTokenToFirestore('user-123', 'bad-token')
      ).rejects.toThrow('firestore error');
    });
  });

  // ---------------------------------------------------------------------------
  // removeTokenFromFirestore
  // ---------------------------------------------------------------------------

  describe('removeTokenFromFirestore', () => {
    it('deve chamar deleteDoc no documento correto', async () => {
      const userId = 'user-456';
      const token = 'fcm-token-xyz';

      await FirebaseMessagingService.removeTokenFromFirestore(userId, token);

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'fcmTokens');
      expect(doc).toHaveBeenCalled();
      expect(deleteDoc).toHaveBeenCalled();
    });

    it('deve propagar erro se deleteDoc falhar', async () => {
      vi.mocked(deleteDoc).mockRejectedValueOnce(new Error('delete error'));

      await expect(
        FirebaseMessagingService.removeTokenFromFirestore('user-456', 'fcm-token-xyz')
      ).rejects.toThrow('delete error');
    });
  });

  // ---------------------------------------------------------------------------
  // setupForegroundListener
  // ---------------------------------------------------------------------------

  describe('setupForegroundListener', () => {
    it('deve retornar uma função de cleanup', () => {
      const cleanup = FirebaseMessagingService.setupForegroundListener();
      expect(typeof cleanup).toBe('function');
    });

    it('deve retornar no-op se messaging não disponível (getMessagingInstance = null)', async () => {
      // getMessagingInstance já retorna null pelo beforeEach
      vi.mocked(onMessage).mockClear();

      const cleanup = FirebaseMessagingService.setupForegroundListener();

      // Aguarda a promise interna de getMessagingInstance resolver
      await new Promise((resolve) => setTimeout(resolve, 20));

      // onMessage não deve ter sido chamado pois messaging é null
      expect(onMessage).not.toHaveBeenCalled();
      expect(typeof cleanup).toBe('function');
    });

    it('deve registrar onMessage e exibir toast quando messaging está disponível', async () => {
      const mockMessagingObj = { type: 'mock-messaging-foreground' };
      vi.mocked(getMessagingInstance).mockResolvedValueOnce(mockMessagingObj as any);

      const unsubscribeMock = vi.fn();
      vi.mocked(onMessage).mockReturnValueOnce(unsubscribeMock);

      FirebaseMessagingService.setupForegroundListener();

      // Aguarda a promise interna resolver
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(onMessage).toHaveBeenCalledWith(mockMessagingObj, expect.any(Function));

      // Dispara o callback manualmente para verificar o toast
      const messageCallback = vi.mocked(onMessage).mock.calls[0][1] as (payload: any) => void;
      messageCallback({
        notification: { title: 'Teste', body: 'Corpo da mensagem' },
      });

      expect(toast).toHaveBeenCalledWith('Teste', { description: 'Corpo da mensagem' });
    });

    it('deve usar título padrão "MindEase" quando notification.title não está definido', async () => {
      const mockMessagingObj = { type: 'mock-messaging-default-title' };
      vi.mocked(getMessagingInstance).mockResolvedValueOnce(mockMessagingObj as any);
      vi.mocked(onMessage).mockReturnValueOnce(vi.fn());

      FirebaseMessagingService.setupForegroundListener();
      await new Promise((resolve) => setTimeout(resolve, 20));

      const messageCallback = vi.mocked(onMessage).mock.calls[0][1] as (payload: any) => void;
      messageCallback({ notification: {} });

      expect(toast).toHaveBeenCalledWith('MindEase', { description: '' });
    });
  });

  // ---------------------------------------------------------------------------
  // getCurrentToken
  // ---------------------------------------------------------------------------

  describe('getCurrentToken', () => {
    it('deve retornar string | null (token em memória do módulo)', () => {
      const token = FirebaseMessagingService.getCurrentToken();
      expect(token === null || typeof token === 'string').toBe(true);
    });
  });
});
