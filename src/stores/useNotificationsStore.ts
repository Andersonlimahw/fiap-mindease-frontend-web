import { create } from 'zustand';

/**
 * Store de notificações push (FCM).
 *
 * Gerencia apenas o estado relacionado às notificações do Firebase Cloud Messaging:
 * permissão do browser, flag de habilitação e token FCM do dispositivo.
 *
 * A lógica assíncrona (requisição de permissão, obtenção do token, recebimento
 * de mensagens) fica encapsulada no FirebaseMessagingService — este store expõe
 * somente setters simples para que o service atualize o estado de forma reativa.
 */
interface NotificationsState {
  /** Status da permissão de notificação do browser, ou 'loading' / 'unsupported'. */
  permissionStatus: NotificationPermission | 'loading' | 'unsupported';
  /** Indica se as notificações push estão habilitadas para o usuário atual. */
  isEnabled: boolean;
  /** Token FCM registrado no Firebase, ou null se ainda não obtido. */
  fcmToken: string | null;
  setPermissionStatus: (status: NotificationPermission | 'loading' | 'unsupported') => void;
  setIsEnabled: (enabled: boolean) => void;
  setFcmToken: (token: string | null) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  (set) => ({
    permissionStatus: 'loading',
    isEnabled: false,
    fcmToken: null,

    setPermissionStatus: (status) => set({ permissionStatus: status }),
    setIsEnabled: (enabled) => set({ isEnabled: enabled }),
    setFcmToken: (token) => set({ fcmToken: token }),
  })
);

// Verifica suporte a notificações na inicialização do módulo
if (!('Notification' in window)) {
  useNotificationsStore.getState().setPermissionStatus('unsupported');
} else {
  useNotificationsStore.getState().setPermissionStatus(Notification.permission);
}
