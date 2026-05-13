import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
}

export default function Portal({ children, container = document.body }: PortalProps) {
  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
