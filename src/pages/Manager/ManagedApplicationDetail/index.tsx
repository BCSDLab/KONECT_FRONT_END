import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useApproveManagedApplicationMutation, useRejectManagedApplicationMutation } from '@/apis/club/managedHooks';
import { managedClubQueries } from '@/apis/club/managedQueries';
import BottomModal from '@/components/common/BottomModal';
import { useToastContext } from '@/contexts/useToastContext';
import ApplicationDetailContent from '@/pages/Manager/components/ApplicationDetailContent';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { cn } from '@/utils/ts/cn';

const BUTTON_BASE_CLASS =
  'flex h-[55px] flex-1 items-center justify-center rounded-2xl border border-[#69BFDF] text-center text-[16px] leading-[22px] font-bold tracking-[-0.408px]';
const BUTTON_SECONDARY_CLASS = 'text-[#69BFDF]';
const BUTTON_PRIMARY_CLASS = 'bg-[#69BFDF] text-white';
const BUTTON_DISABLED_CLASS = 'disabled:opacity-50';
const BUTTON_DISABLED_WITH_CURSOR_CLASS = 'disabled:cursor-not-allowed disabled:opacity-50';

function ManagedApplicationDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const clubId = Number(params.clubId);
  const applicationId = Number(params.applicationId);

  const { showToast } = useToastContext();
  const { data: application } = useSuspenseQuery(managedClubQueries.applicationDetail(clubId, applicationId));
  const { mutate: approve, isPending: isApproving } = useApproveManagedApplicationMutation(clubId);
  const { mutate: reject, isPending: isRejecting } = useRejectManagedApplicationMutation(clubId);
  const { value: isApproveOpen, setTrue: openApprove, setFalse: closeApprove } = useBooleanState();
  const { value: isRejectOpen, setTrue: openReject, setFalse: closeReject } = useBooleanState();

  const isPending = isApproving || isRejecting;

  const handleApprove = () => {
    approve(application.applicationId, {
      onSuccess: () => {
        showToast('지원이 승인되었습니다');
        closeApprove();
        navigate(-1);
      },
      onError: () => showToast('요청 처리에 실패했습니다'),
    });
  };

  const handleReject = () => {
    reject(application.applicationId, {
      onSuccess: () => {
        showToast('지원이 거절되었습니다');
        closeReject();
        navigate(-1);
      },
      onError: () => showToast('요청 처리에 실패했습니다'),
    });
  };

  return (
    <>
      <ApplicationDetailContent
        application={application}
        footer={
          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={openReject}
              disabled={isPending}
              className={cn(BUTTON_BASE_CLASS, BUTTON_SECONDARY_CLASS, BUTTON_DISABLED_WITH_CURSOR_CLASS)}
            >
              {isRejecting ? '거절 중...' : '거절'}
            </button>
            <button
              type="button"
              onClick={openApprove}
              disabled={isPending}
              className={cn(BUTTON_BASE_CLASS, BUTTON_PRIMARY_CLASS, BUTTON_DISABLED_WITH_CURSOR_CLASS)}
            >
              {isApproving ? '승인 중...' : '승인'}
            </button>
          </div>
        }
      />

      <BottomModal isOpen={isApproveOpen} onClose={closeApprove}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">지원 승인</div>
          <div className="text-body3 text-indigo-400">{application.name}님의 지원을 승인하시겠어요?</div>
          <div className="mt-1 flex gap-3">
            <button type="button" onClick={closeApprove} className={cn(BUTTON_BASE_CLASS, BUTTON_SECONDARY_CLASS)}>
              취소
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={isPending}
              className={cn(BUTTON_BASE_CLASS, BUTTON_PRIMARY_CLASS, BUTTON_DISABLED_CLASS)}
            >
              {isApproving ? '승인 중...' : '승인'}
            </button>
          </div>
        </div>
      </BottomModal>

      <BottomModal isOpen={isRejectOpen} onClose={closeReject}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">지원 거절</div>
          <div className="text-body3 text-indigo-400">{application.name}님의 지원을 거절하시겠어요?</div>
          <div className="mt-1 flex gap-3">
            <button type="button" onClick={closeReject} className={cn(BUTTON_BASE_CLASS, BUTTON_SECONDARY_CLASS)}>
              취소
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className={cn(BUTTON_BASE_CLASS, BUTTON_PRIMARY_CLASS, BUTTON_DISABLED_CLASS)}
            >
              {isRejecting ? '거절 중...' : '거절'}
            </button>
          </div>
        </div>
      </BottomModal>
    </>
  );
}

export default ManagedApplicationDetail;
