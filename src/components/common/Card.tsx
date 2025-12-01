import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className, ...props }: CardProps) {
  const base = 'border-indigo-5 flex w-full flex-col gap-3 rounded-lg border bg-white p-3';

  return (
    <div className={twMerge(clsx(base, className))} {...props}>
      {children}
    </div>
  );
}

export default Card;
