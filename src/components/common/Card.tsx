import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/ts/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn('border-indigo-5 flex w-full flex-col gap-3 rounded-lg border bg-white p-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
