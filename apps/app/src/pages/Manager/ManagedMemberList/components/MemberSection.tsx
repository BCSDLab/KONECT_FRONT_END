import type { ReactNode } from 'react';

export default function MemberSection({ title, children }: { children: ReactNode; title: string }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="px-px text-[14px] leading-[1.6] font-medium text-indigo-500">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}
