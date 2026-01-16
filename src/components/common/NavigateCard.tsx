import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface NavigateCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
  replace?: boolean;
  children: ReactNode;
}

function NavigateCard({ to, replace = false, children, className, ...props }: NavigateCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to, { replace });
  };

  const base =
    'border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3 text-left transition hover:bg-indigo-50 active:scale-[0.98]';

  return (
    <button type="button" onClick={handleClick} className={twMerge(clsx(base, className))} {...props}>
      {children}
    </button>
  );
}

export default NavigateCard;
