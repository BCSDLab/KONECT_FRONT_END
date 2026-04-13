import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { PositionType } from '@/apis/club/entity';
import { managedClubQueries } from '@/apis/club/managedQueries';
import CheckIcon from '@/assets/svg/check.svg';
import PersonAddIcon from '@/assets/svg/person-add-icon.svg';
import BottomOverlaySpacer from '@/components/layout/BottomOverlaySpacer';
import { useInAppNotificationToastContext } from '@/contexts/useInAppNotificationToastContext';
import { useToastContext } from '@/contexts/useToastContext';
import { useConfirmManagedClubSheetImportMutation } from '@/pages/Manager/hooks/useManagedMemberMutations';
import { MemberAvatar } from '@/pages/Manager/ManagedMemberList/components/MemberCard';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import { cn } from '@/utils/ts/cn';

const POSITION_LABELS: Record<PositionType, string> = {
  PRESIDENT: '회장',
  VICE_PRESIDENT: '부회장',
  MANAGER: '운영진',
  MEMBER: '부원',
};
const ACTION_BAR_RESERVED_SPACE = 'calc(84px + var(--sab))';

function ManagedSheetImportPreview() {
  const navigate = useNavigate();
  const { clubId } = useParams<{ clubId: string }>();
  const clubIdNumber = Number(clubId);
  const { showInAppNotificationToast } = useInAppNotificationToastContext();
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();
  const { data: preview } = useSuspenseQuery(managedClubQueries.sheetImportPreview(clubIdNumber));
  const { mutate: confirmSheetImport, isPending: isConfirming } =
    useConfirmManagedClubSheetImportMutation(clubIdNumber);

  const [enabledByStudentNumber, setEnabledByStudentNumber] = useState<Record<string, boolean>>(() =>
    preview.members.reduce<Record<string, boolean>>((acc, member) => {
      acc[member.studentNumber] = member.enabled;
      return acc;
    }, {})
  );

  const toggleEnabled = (studentNumber: string) => {
    setEnabledByStudentNumber((prev) => ({ ...prev, [studentNumber]: !prev[studentNumber] }));
  };

  const handleCancel = () => {
    if (isConfirming) return;
    navigate(-1);
  };

  const handleSubmit = () => {
    if (isConfirming) return;

    const members = preview.members.map((member) => ({
      studentNumber: member.studentNumber,
      name: member.name,
      clubPosition: member.clubPosition,
      enabled: enabledByStudentNumber[member.studentNumber] ?? member.enabled,
    }));

    if (!members.some((member) => member.enabled)) {
      showToast('등록할 부원을 선택해주세요.', 'error');
      return;
    }

    confirmSheetImport(
      { members },
      {
        onSuccess: () => {
          showInAppNotificationToast({
            message: '인명부 등록이 완료되었어요',
            variant: 'approved',
          });
          navigate(`/mypage/manager/${clubIdNumber}/members`);
        },
        onError: (error) => showApiErrorToast(error, '부원 등록에 실패했습니다.'),
      }
    );
  };

  return (
    <div className="flex min-h-full flex-col px-4.75 pt-4.25">
      <div className="flex flex-col gap-9">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
          <div className="flex size-15 shrink-0 items-center justify-center text-indigo-300">
            <PersonAddIcon />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-text-700 leading-[1.6] font-bold">{preview.previewCount}명이 새로 추가돼요</p>
            <p className="text-[11px] leading-3.75 text-indigo-300">
              아래 인원이 부원으로 새로 등록될 예정이에요.
              <br />
              등록하기를 누르면 자동으로 등록 돼요.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {preview.members.map((member) => {
            const isEnabled = enabledByStudentNumber[member.studentNumber] ?? member.enabled;

            return (
              <div
                key={member.studentNumber}
                className="border-background flex items-center justify-between rounded-2xl border bg-white p-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <MemberAvatar name={member.name} />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] leading-[1.6] font-semibold text-indigo-700">
                      {member.name} ({member.studentNumber})
                    </div>
                    <div className="text-text-500 text-[13px] leading-[1.6] font-medium">
                      {POSITION_LABELS[member.clubPosition]}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleEnabled(member.studentNumber)}
                  className="flex shrink-0 items-center gap-1"
                  aria-pressed={isEnabled}
                  aria-label={`${member.name} 활성화 토글`}
                >
                  <span className="text-text-500 text-[13px] leading-[1.6] font-medium">활성화</span>
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded border-[0.5px] border-[#cdcdcd] bg-white',
                      isEnabled ? 'text-primary-500' : 'text-transparent'
                    )}
                  >
                    <CheckIcon className="size-4" />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <BottomOverlaySpacer style={{ height: ACTION_BAR_RESERVED_SPACE }} />

      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 rounded-t-[20px] border-t border-[#e0e0e0] bg-white px-4 pt-3"
        style={{ paddingBottom: 'calc(12px + var(--sab))' }}
      >
        <button
          type="button"
          onClick={handleCancel}
          disabled={isConfirming}
          className="border-primary-500 text-primary-500 h-12 flex-1 rounded-2xl border bg-white leading-5.5 font-bold disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isConfirming}
          className="bg-primary-500 h-12 flex-1 rounded-2xl leading-5.5 font-bold text-white disabled:opacity-50"
        >
          {isConfirming ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
}

export default ManagedSheetImportPreview;
