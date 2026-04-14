import type { MouseEvent } from 'react';
import type { ClubApplicationsResponse } from '@/apis/club/entity';
import CheckIcon from '@/assets/svg/check-icon.svg';
import CloseIcon from '@/assets/svg/close-icon.svg';
import PersonIcon from '@/assets/svg/person-icon.svg';
import SmsIcon from '@/assets/svg/sms-icon.svg';
import { formatIsoDateToYyyyMmDdHhMm } from '@/utils/ts/datetime/date';

type ManagedApplication = ClubApplicationsResponse['applications'][number];

interface ApplicationCardProps {
  application: ManagedApplication;
  disabled: boolean;
  onApprove: (e: MouseEvent<HTMLButtonElement>, applicationId: number) => void;
  onReject: (e: MouseEvent<HTMLButtonElement>, applicationId: number) => void;
  onDetail: (applicationId: number) => void;
  onChat: (e: MouseEvent<HTMLButtonElement>, userId: number) => void;
}

function ApplicationCard({ application, disabled, onApprove, onReject, onDetail, onChat }: ApplicationCardProps) {
  const actions = [
    {
      key: 'approve',
      label: '지원 승인',
      icon: CheckIcon,
      onClick: (e: MouseEvent<HTMLButtonElement>) => onApprove(e, application.id),
    },
    {
      key: 'reject',
      label: '지원 거절',
      icon: CloseIcon,
      onClick: (e: MouseEvent<HTMLButtonElement>) => onReject(e, application.id),
    },
    {
      key: 'chat',
      label: '지원자 채팅',
      icon: SmsIcon,
      onClick: (e: MouseEvent<HTMLButtonElement>) => onChat(e, application.userId),
    },
  ];

  return (
    <div
      className="border-indigo-5 active:bg-indigo-5/60 flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-3"
      onClick={() => onDetail(application.id)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="bg-text-100 flex size-10 items-center justify-center rounded-[10px]">
          <PersonIcon />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] leading-6 font-semibold text-indigo-700">
            {application.name} ({application.studentNumber})
          </div>
          <div className="text-[13px] leading-[1.6] font-medium text-indigo-300">
            지원일 : {formatIsoDateToYyyyMmDdHhMm(application.appliedAt)}
          </div>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {actions.map(({ key, label, icon: Icon, onClick }) => (
          <button
            key={key}
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={`${application.name} ${label}`}
          >
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ApplicationCard;
