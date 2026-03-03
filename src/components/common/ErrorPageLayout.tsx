import type { ReactNode } from 'react';

interface ErrorPageLayoutProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  message: ReactNode;
  primaryLabel: string;
  onPrimaryClick: () => void;
}

function ErrorPageLayout({ imageSrc, imageAlt, title, message, primaryLabel, onPrimaryClick }: ErrorPageLayoutProps) {
  return (
    <section className="bg-indigo-5 flex min-h-(--viewport-height) w-full flex-col items-center px-8 pt-[22vh]">
      <div className="flex w-full max-w-[323px] flex-col items-center gap-3">
        <img src={imageSrc} alt={imageAlt} className="h-auto w-[243px]" />

        <div className="flex w-full flex-col items-center gap-[26px] text-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-[24px] leading-[22px] font-bold tracking-[-0.408px] text-black">{title}</h1>
            <p className="text-[16px] leading-[22px] tracking-[-0.408px] text-indigo-200">{message}</p>
          </div>

          <button
            type="button"
            onClick={onPrimaryClick}
            className="text-indigo-5 w-full rounded-[10px] bg-[#69BFDF] py-[15px] text-[16px] leading-[22px] font-bold tracking-[-0.408px]"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ErrorPageLayout;
