function StepLayout({
  title,
  description,
  onNext,
  nextDisabled = false,
  children,
  color = 'text-indigo-300',
}: {
  title: string;
  description: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5" style={{ marginBottom: 'calc(32px + var(--sab))' }}>
      <div className="flex flex-col gap-2">
        <div className="text-d2">{title}</div>
        <div className={`${color} text-sm leading-5 font-medium whitespace-pre-line`}>{description}</div>

        {children}
      </div>

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="bg-primary text-indigo-0 h-12 w-full items-center rounded-lg font-extrabold disabled:cursor-not-allowed disabled:opacity-50"
        >
          다음
        </button>
      )}
    </div>
  );
}

export default StepLayout;
