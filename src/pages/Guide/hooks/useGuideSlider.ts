import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useGuideSlider(total: number) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const isLast = index === total - 1;

  const next = useCallback(() => {
    if (isLast) {
      navigate('/home');
      return;
    }
    setIndex((prev) => prev + 1);
  }, [isLast, navigate]);

  const prev = useCallback(() => {
    if (index === 0) return;
    setIndex((prev) => prev - 1);
  }, [index]);

  return {
    index,
    isLast,
    next,
    prev,
  };
}
