import { useParams } from 'react-router-dom';
import CheckIcon from '@/assets/svg/check.svg';
import WarningIcon from '@/assets/svg/warning.svg';
import BottomModal from '@/components/common/BottomModal';
import Portal from '@/components/common/Portal';
import Toast from '@/components/common/Toast';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useToast } from '@/utils/hooks/useToast';
import { formatIsoDateToYYYYMMDD } from '@/utils/ts/date';
import { useApplicationApprove, useApplicationReject, useManagedClubApplicationDetail } from '../hooks/useManagerQuery';

function ManagedApplicationDetail() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const applicationId = Number(params.applicationId);

  const { toast, showToast, hideToast } = useToast();
  const { managedClubApplicationDetail: application } = useManagedClubApplicationDetail(clubId, applicationId);
  const { mutate: approve, isPending: isApproving } = useApplicationApprove(clubId, {
    navigateBack: true,
    onSuccess: () => showToast('지원이 승인되었습니다'),
  });
  const { mutate: reject, isPending: isRejecting } = useApplicationReject(clubId, {
    navigateBack: true,
    onSuccess: () => showToast('지원이 거절되었습니다'),
  });

  const { value: isImageOpen, setTrue: openImage, setFalse: closeImage } = useBooleanState();
  const { value: isApproveOpen, setTrue: openApprove, setFalse: closeApprove } = useBooleanState();
  const { value: isRejectOpen, setTrue: openReject, setFalse: closeReject } = useBooleanState();

  const isPending = isApproving || isRejecting;

  const handleApprove = () => {
    approve(application.applicationId);
    closeApprove();
  };

  const handleReject = () => {
    reject(application.applicationId);
    closeReject();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-3">
        <section className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-14 rounded-full object-cover"
              src={application.imageUrl}
              alt={`${application.name} 프로필`}
            />
            <div className="flex flex-col gap-1">
              <div className="text-h4 text-indigo-700">
                {application.name}
                <span className="text-sub3 ml-2 text-indigo-400">({application.studentNumber})</span>
              </div>
              <div className="text-sub4 text-gray-500">지원일: {formatIsoDateToYYYYMMDD(application.appliedAt)}</div>
            </div>
          </div>
        </section>

        {application.feePaymentImageUrl && (
          <section className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <span className="text-h4">회비 납부 인증</span>
            <button type="button" onClick={openImage} className="cursor-pointer">
              <img
                src={application.feePaymentImageUrl}
                alt="회비 납부 인증"
                className="w-full rounded-lg object-contain"
              />
            </button>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-h4">지원서 내용</span>
            <span className="text-sub4 text-gray-500">{application.answers.length}개의 문항</span>
          </div>

          <div className="flex flex-col gap-3">
            {application.answers.map((answer, index) => (
              <div
                key={answer.questionId}
                className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sub2 font-semibold text-indigo-700">문항 {index + 1}</span>
                  {answer.isRequired && (
                    <span className="text-cap1 rounded-full bg-red-50 px-2 py-0.5 text-red-500">필수</span>
                  )}
                </div>

                <p className="text-sub3 text-gray-700">{answer.question}</p>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sub3 whitespace-pre-wrap text-gray-600">{answer.answer || '(응답 없음)'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex gap-3 p-3" style={{ marginBottom: 'calc(20px + var(--sab))' }}>
        <button
          type="button"
          onClick={openReject}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white py-3 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <WarningIcon className="h-5 w-5" />
          <span>거절</span>
        </button>
        <button
          type="button"
          onClick={openApprove}
          disabled={isPending}
          className="bg-primary flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          <CheckIcon className="h-5 w-5" />
          <span>승인</span>
        </button>
      </div>

      {/* Approve Confirm Modal */}
      <BottomModal isOpen={isApproveOpen} onClose={closeApprove}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">지원 승인</div>
          <div className="text-body3 text-indigo-400">{application.name}님의 지원을 승인하시겠어요?</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeApprove}
              className="border-indigo-25 flex-1 rounded-lg border py-3 text-center font-bold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={isPending}
              className="bg-primary flex-1 rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
            >
              {isApproving ? '승인 중...' : '승인'}
            </button>
          </div>
        </div>
      </BottomModal>

      {/* Reject Confirm Modal */}
      <BottomModal isOpen={isRejectOpen} onClose={closeReject}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">지원 거절</div>
          <div className="text-body3 text-indigo-400">{application.name}님의 지원을 거절하시겠어요?</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeReject}
              className="border-indigo-25 flex-1 rounded-lg border py-3 text-center font-bold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="flex-1 rounded-lg bg-red-500 py-3 text-center font-bold text-white disabled:opacity-50"
            >
              {isRejecting ? '거절 중...' : '거절'}
            </button>
          </div>
        </div>
      </BottomModal>

      {isImageOpen && application.feePaymentImageUrl && (
        <Portal>
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80" onClick={closeImage}>
            <img
              src={application.feePaymentImageUrl}
              alt="회비 납부 인증"
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </Portal>
      )}

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}

export default ManagedApplicationDetail;
