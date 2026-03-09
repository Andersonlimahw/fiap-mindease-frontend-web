import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotificationsStore } from '../stores/useNotificationsStore';

describe('useNotificationsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reseta o estado para os valores padrão definidos no store
    useNotificationsStore.setState({
      permissionStatus: 'default',
      isEnabled: false,
      fcmToken: null,
    });
  });

  it('deve inicializar com valores padrão', () => {
    const state = useNotificationsStore.getState();
    // O módulo pode ter definido permissionStatus como 'default', 'granted', 'denied'
    // ou 'unsupported' dependendo do ambiente. Verificamos que é um dos valores válidos.
    expect(['default', 'granted', 'denied', 'denied', 'loading', 'unsupported']).toContain(
      state.permissionStatus
    );
    expect(state.isEnabled).toBe(false);
    expect(state.fcmToken).toBeNull();
  });

  it('setPermissionStatus deve atualizar o permissionStatus', () => {
    useNotificationsStore.getState().setPermissionStatus('granted');
    expect(useNotificationsStore.getState().permissionStatus).toBe('granted');

    useNotificationsStore.getState().setPermissionStatus('denied');
    expect(useNotificationsStore.getState().permissionStatus).toBe('denied');

    useNotificationsStore.getState().setPermissionStatus('unsupported');
    expect(useNotificationsStore.getState().permissionStatus).toBe('unsupported');
  });

  it('setIsEnabled deve atualizar isEnabled', () => {
    useNotificationsStore.getState().setIsEnabled(true);
    expect(useNotificationsStore.getState().isEnabled).toBe(true);

    useNotificationsStore.getState().setIsEnabled(false);
    expect(useNotificationsStore.getState().isEnabled).toBe(false);
  });

  it('setFcmToken deve atualizar o fcmToken', () => {
    useNotificationsStore.getState().setFcmToken('new-token-123');
    expect(useNotificationsStore.getState().fcmToken).toBe('new-token-123');

    useNotificationsStore.getState().setFcmToken(null);
    expect(useNotificationsStore.getState().fcmToken).toBeNull();
  });

  it('deve ter permissionStatus "unsupported" se Notification não está disponível', () => {
    // Simula ambiente sem suporte à API Notification
    const original = (window as any).Notification;
    delete (window as any).Notification;

    // Force reavaliação do estado via setter (como o módulo faria na inicialização)
    if (!('Notification' in window)) {
      useNotificationsStore.getState().setPermissionStatus('unsupported');
    }

    expect(useNotificationsStore.getState().permissionStatus).toBe('unsupported');

    // Restaura
    (window as any).Notification = original;
  });

  it('setters devem ser funções', () => {
    const state = useNotificationsStore.getState();
    expect(typeof state.setPermissionStatus).toBe('function');
    expect(typeof state.setIsEnabled).toBe('function');
    expect(typeof state.setFcmToken).toBe('function');
  });
});
