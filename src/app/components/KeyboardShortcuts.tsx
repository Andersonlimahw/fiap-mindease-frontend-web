import { useEffect } from 'react';
import { useNavigationStore, type Screen } from '@/stores';

export function KeyboardShortcuts() {
  const { navigate } = useNavigationStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Alt + number shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('dashboard');
            break;
          case '2':
            e.preventDefault();
            navigate('focus');
            break;
          case '3':
            e.preventDefault();
            navigate('tasks');
            break;
          case '4':
            e.preventDefault();
            navigate('reader');
            break;
          case '5':
            e.preventDefault();
            navigate('pomodoro');
            break;
          case '6':
            e.preventDefault();
            navigate('chat');
            break;
          case '9':
            e.preventDefault();
            navigate('settings');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return null;
}