import type { MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClubApplicationsResponse } from '@/apis/club/entity';
import CheckIcon from '@/assets/svg/check.svg';
import CloseIcon from '@/assets/svg/close.svg';
import PersonIcon from '@/assets/svg/person.svg';
import { useToastContext } from '@/contexts/useToastContext';
import {
  useApproveManagedApplicationMutation,
  useRejectManagedApplicationMutation,
} from '@/pages/Manager/hooks/useManagedApplicationMutations';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import { formatIsoDateToYYYYMMDDHHMM } from '@/utils/ts/date';
import { useGetManagedApplications } from '../hooks/useManagedApplications';

type ManagedApplication = ClubApplicationsResponse['applications'][number];

function ApplicationAvatar({ imageUrl, name }: Pick<ManagedApplication, 'imageUrl' | 'name'>) {
  if (imageUrl) {
    return <img className="h-10 w-10 rounded-[10px] object-cover" src={imageUrl} alt={`${name} 프로필 이미지`} />;
  }

  return (
    <div className="bg-indigo-25 flex h-10 w-10 items-center justify-center rounded-[10px] text-indigo-400">
      <PersonIcon className="h-6 w-6" />
    </div>
  );
}

interface ApplicationCardProps {
  application: ManagedApplication;
  disabled: boolean;
  onApprove: (e: MouseEvent<HTMLButtonElement>, applicationId: number) => void;
  onReject: (e: MouseEvent<HTMLButtonElement>, applicationId: number) => void;
  onDetail: (applicationId: number) => void;
}

function ApplicationCard({ application, disabled, onApprove, onReject, onDetail }: ApplicationCardProps) {
  return (
    <div
      className="border-indigo-5 active:bg-indigo-5/60 flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-3"
      onClick={() => onDetail(application.id)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <ApplicationAvatar imageUrl={application.imageUrl} name={application.name} />
        <div className="min-w-0">
          <div className="truncate text-[15px] leading-6 font-semibold text-indigo-700">
            {application.name} ({application.studentNumber})
          </div>
          <div className="text-[13px] leading-[1.6] font-medium text-indigo-300">
            지원일 : {formatIsoDateToYYYYMMDDHHMM(application.appliedAt)}
          </div>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={(e) => onApprove(e, application.id)}
          disabled={disabled}
          aria-label={`${application.name} 지원 승인`}
          className="flex h-6 w-6 items-center justify-center text-[#69BFDF] disabled:opacity-50"
        >
          <CheckIcon className="h-[26px] w-[26px]" />
        </button>

        <button
          type="button"
          onClick={(e) => onReject(e, application.id)}
          disabled={disabled}
          aria-label={`${application.name} 지원 거절`}
          className="flex h-6 w-6 items-center justify-center text-indigo-300 disabled:opacity-50"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

function ManagedApplicationList() {
  const params = useParams();
  const navigate = useNavigate();
  const clubId = Number(params.clubId);
  const { showToast } = useToastContext();

  const limit = 10;

  const { managedClubApplicationList, applications, fetchNextPage, hasNextPage, isFetchingNextPage, hasNoRecruitment } =
    useGetManagedApplications(clubId, { limit });

  const { mutate: approve, isPending: isApproving } = useApproveManagedApplicationMutation(clubId);
  const { mutate: reject, isPending: isRejecting } = useRejectManagedApplicationMutation(clubId);
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, {
    enabled: !hasNoRecruitment,
  });

  const isPending = isApproving || isRejecting;

  const handleApprove = (e: MouseEvent<HTMLButtonElement>, applicationId: number) => {
    e.stopPropagation();
    approve(applicationId, {
      onSuccess: () => showToast('지원이 승인되었습니다'),
    });
  };

  const handleReject = (e: MouseEvent<HTMLButtonElement>, applicationId: number) => {
    e.stopPropagation();
    reject(applicationId, {
      onSuccess: () => showToast('지원이 거절되었습니다'),
    });
  };

  const handleDetail = (applicationId: number) => {
    navigate(`${applicationId}`);
  };

  if (hasNoRecruitment) {
    return (
      <div className="flex flex-col gap-9 px-[19px] py-[17px]">
        <UserInfoCard type="detail" />
        <div className="border-indigo-5 flex items-center justify-center rounded-2xl border bg-white px-4 py-10">
          <p className="text-body2 font-medium text-indigo-300">현재 진행 중인 모집 공고가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9 px-[19px] py-[17px]">
      <UserInfoCard type="detail" />

      <div className="flex flex-col gap-2">
        <div className="border-indigo-5 rounded-2xl border bg-white px-3 py-3">
          <span className="text-text-600 text-[15px] leading-6 font-semibold">
            대기중 {managedClubApplicationList?.totalCount ?? 0}명
          </span>
        </div>

        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              disabled={isPending}
              onApprove={handleApprove}
              onReject={handleReject}
              onDetail={handleDetail}
            />
          ))
        ) : (
          <div className="border-indigo-5 flex items-center justify-center rounded-2xl border bg-white px-4 py-10">
            <p className="text-body2 font-medium text-indigo-300">현재 대기 중인 지원자가 없습니다.</p>
          </div>
        )}

        {hasNextPage && (
          <div ref={observerRef} className="text-cap1 flex h-12 items-center justify-center text-indigo-300">
            {isFetchingNextPage ? '지원자를 불러오는 중입니다.' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagedApplicationList;
