import { useEffect } from 'react';

export default function useScrollToTop() {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, left: 0 });
    } else {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, []);
}
