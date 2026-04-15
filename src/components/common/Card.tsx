import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(clsx('border-indigo-5 flex w-full flex-col gap-3 rounded-lg border bg-white p-3', className))}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
