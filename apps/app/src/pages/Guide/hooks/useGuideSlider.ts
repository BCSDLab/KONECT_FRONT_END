import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useGuideSlider(total: number) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const isLast = total > 0 && index === total - 1;

  const next = useCallback(() => {
    if (total <= 0) return;

    if (isLast) {
      navigate('/home');
      return;
    }

    setIndex((prev) => Math.min(prev + 1, total - 1));
  }, [isLast, navigate, total]);

  const prev = useCallback(() => {
    setIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    index,
    isLast,
    next,
    prev,
  };
}
