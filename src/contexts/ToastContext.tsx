import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Toast from '@/components/common/Toast';
import type { ToastData } from '@/utils/hooks/useToast';
import { ToastContext } from './useToastContext';

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} onClose={handleClose} />
    </ToastContext.Provider>
  );
}
