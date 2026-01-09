import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element;
}

export default function Portal({ children, container = document.body }: PortalProps) {
  return createPortal(children, container);
}
