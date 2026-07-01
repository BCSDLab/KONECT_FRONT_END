import type { ReactNode } from 'react';
import { cn } from '@konect/utils/cn';

function InfoBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'bg-primary-100 border-primary-400 text-primary-500 flex min-h-16 w-full items-center justify-center gap-2.5 rounded-[30px] border-2 px-7.5 py-3 text-[20px] leading-10 font-semibold sm:text-[24px]',
        className
      )}
    >
      <span className="bg-primary-500 size-2 shrink-0 rounded-full" aria-hidden="true" />
      {children}
    </div>
  );
}

export default InfoBadge;
