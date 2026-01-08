import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';
import useScrollLock from '@/utils/hooks/useScrollLock';
import Portal from './Portal';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useClickTouchOutside(modalRef, onClose);
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
        <dialog
          ref={modalRef}
          open={isOpen}
          className={twMerge(
            'fixed top-1/2 left-1/2 min-w-11/12 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white',
            className
          )}
        >
          {children}
        </dialog>
      </div>
    </Portal>
  );
}

export default Modal;
