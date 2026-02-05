import type { ToastData } from '@/utils/hooks/useToast';
import Portal from './Portal';

const INDICATOR_COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
} as const;

interface ToastProps {
  toast: ToastData | null;
  onClose?: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-24 z-200 flex flex-col items-center gap-2 px-4">
        <div
          className="animate-fade-in-up flex w-full max-w-sm items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 shadow-lg"
          onClick={onClose}
        >
          <span className={`${INDICATOR_COLORS[toast.type]} h-2 w-2 shrink-0 rounded-full`} />
          <span className="text-sm font-medium text-white">{toast.message}</span>
        </div>
      </div>
    </Portal>
  );
}

export default Toast;
