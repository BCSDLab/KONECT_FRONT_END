import { createContext, useContext, type RefObject } from 'react';

interface LayoutElementsContextType {
  mainRef: RefObject<HTMLElement | null>;
  bottomNavRef: RefObject<HTMLElement | null>;
}

export const LayoutElementsContext = createContext<LayoutElementsContextType | undefined>(undefined);

export function useLayoutElementsContext(): LayoutElementsContextType {
  const context = useContext(LayoutElementsContext);

  if (!context) {
    throw new Error('useLayoutElementsContext must be used within a Layout');
  }

  return context;
}
