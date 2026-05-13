export function MemberAvatar({ name }: { name: string }) {
  return (
    <div
      className="bg-indigo-25 text-text-600 flex size-10 shrink-0 items-center justify-center rounded-[10px] text-[15px] leading-6 font-medium"
      aria-hidden="true"
    >
      {name.charAt(0)}
    </div>
  );
}
