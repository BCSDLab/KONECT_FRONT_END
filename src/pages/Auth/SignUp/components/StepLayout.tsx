function StepLayout({
  title,
  description,
  onNext,
  nextDisabled = false,
  children,
}: {
  title: string;
  description: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5">
      <div className="flex flex-col gap-2">
        <div className="text-[28px] font-extrabold">{title}</div>
        <div className="text-body-4-m whitespace-pre-line text-indigo-300">{description}</div>
        {children}
      </div>

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="bg-primary text-indigo-0 mb-8 h-12 w-full items-center rounded-lg font-extrabold disabled:cursor-not-allowed disabled:opacity-50"
        >
          다음
        </button>
      )}
    </div>
  );
}

export default StepLayout;
