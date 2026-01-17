import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';
import useScrollLock from '@/utils/hooks/useScrollLock';
import Portal from './Portal';

interface BottomModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function BottomModal({ isOpen, onClose, children, className }: BottomModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickTouchOutside(modalRef, onClose);
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-100 bg-black/60">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className={twMerge('fixed inset-x-0 bottom-0 rounded-t-3xl bg-white', className)}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export default BottomModal;
