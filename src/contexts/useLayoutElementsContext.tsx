import { createContext, useContext, type RefObject } from 'react';

export interface LayoutElementsContextType {
  layoutElement: HTMLDivElement | null;
  mainRef: RefObject<HTMLElement | null>;
  bottomNavRef: RefObject<HTMLElement | null>;
  bottomOverlayInset: string;
}

export const LayoutElementsContext = createContext<LayoutElementsContextType | undefined>(undefined);

export function useLayoutElementsContext(): LayoutElementsContextType {
  const context = useContext(LayoutElementsContext);

  if (!context) {
    throw new Error('useLayoutElementsContext must be used within a Layout');
  }

  return context;
}
