import type { ReactNode } from 'react';
import type { ClubApplicationDetailResponse } from '@/apis/club/entity';
import Portal from '@/components/common/Portal';
import { useBottomOverlayOffset } from '@/components/layout/bottomOverlay';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { formatIsoDateToYYYYMMDDHHMM } from '@/utils/ts/datetime/date';

type ApplicationAnswer = ClubApplicationDetailResponse['answers'][number];

function ApplicantSummaryCard({
  appliedAt,
  name,
  studentNumber,
}: Pick<ClubApplicationDetailResponse, 'appliedAt' | 'name' | 'studentNumber'>) {
  return (
    <section className="rounded-lg border border-[#F4F6F9] bg-white px-4 py-3 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-3">
        <div className="text-text-600 flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#E7EBEF] text-[20px] leading-[1.6] font-medium">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] leading-[1.6] font-semibold text-indigo-700">
            {name} ({studentNumber})
          </div>
          <div className="text-[13px] leading-[1.6] font-medium text-[#5A6B7F]">
            지원일: {formatIsoDateToYYYYMMDDHHMM(appliedAt)}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeePaymentSection({
  feePaymentImageUrl,
  onOpenImage,
}: {
  feePaymentImageUrl?: string;
  onOpenImage: () => void;
}) {
  return (
    <section className="flex min-h-[261px] flex-col rounded-lg bg-white p-5">
      <h2 className="text-[16px] leading-[1.6] font-semibold text-black">회비 납부 인증</h2>
      {feePaymentImageUrl ? (
        <button
          type="button"
          onClick={onOpenImage}
          className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[#C6CFD8] bg-white"
        >
          <img src={feePaymentImageUrl} alt="회비 납부 인증" className="h-full w-full object-contain" />
        </button>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 rounded-[20px] border border-[#C6CFD8] bg-white" />
      )}
    </section>
  );
}

function AnswerCard({ answer, index }: { answer: ApplicationAnswer; index: number }) {
  return (
    <section className="rounded-lg bg-white p-5">
      <div className="flex flex-col gap-3">
        <p className="text-[16px] leading-[1.6] font-semibold text-black">
          문항{index + 1} {answer.isRequired && <span className="text-red-500">*</span>}
        </p>
        <p className="text-[13px] leading-[1.6] font-medium whitespace-pre-wrap text-[#8497AA]">{answer.question}</p>
        <div className="min-h-[226px] rounded-[20px] border border-[#C6CFD8] bg-white p-4">
          <p className="text-[13px] leading-[1.6] font-medium whitespace-pre-wrap text-[#5A6B7F]">
            {answer.answer || '(응답 없음)'}
          </p>
        </div>
      </div>
    </section>
  );
}

interface ApplicationDetailContentProps {
  application: ClubApplicationDetailResponse;
  footer?: ReactNode;
}

function ApplicationDetailContent({ application, footer }: ApplicationDetailContentProps) {
  const { value: isImageOpen, setTrue: openImage, setFalse: closeImage } = useBooleanState();
  const bottomPadding = useBottomOverlayOffset();

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex flex-1 flex-col gap-6 overflow-auto px-[19px] pt-[17px]"
        style={{ paddingBottom: bottomPadding }}
      >
        <ApplicantSummaryCard
          appliedAt={application.appliedAt}
          name={application.name}
          studentNumber={application.studentNumber}
        />

        <FeePaymentSection feePaymentImageUrl={application.feePaymentImageUrl} onOpenImage={openImage} />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] leading-[1.6] font-semibold text-black">지원서 내용</h2>
            <p className="text-[14px] leading-[1.6] font-medium text-[#8497AA]">
              {application.answers.length}개의 문항
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {application.answers.map((answer, index) => (
              <AnswerCard key={answer.questionId} answer={answer} index={index} />
            ))}
          </div>
        </section>

        {footer}
      </div>

      {isImageOpen && application.feePaymentImageUrl && (
        <Portal>
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80" onClick={closeImage}>
            <img
              src={application.feePaymentImageUrl}
              alt="회비 납부 인증"
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </Portal>
      )}
    </div>
  );
}

export default ApplicationDetailContent;
