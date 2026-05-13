import { useParams } from 'react-router-dom';
import { useGetManagedApplications } from '@/pages/Manager/hooks/useManagedApplications';
import ManagerInfoCard from '@/pages/User/MyPage/components/ManagerInfoCard';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import ApplicationCard from './components/ApplicationCard';
import { useManagedApplicationActions } from './hooks/useManagedApplicationActions';

function ManagedApplicationList() {
  const params = useParams();
  const clubId = Number(params.clubId);

  const { managedClubApplicationList, applications, fetchNextPage, hasNextPage, isFetchingNextPage, hasNoRecruitment } =
    useGetManagedApplications(clubId, { limit: 10 });

  const { isPending, handleApprove, handleReject, handleDetail, handleChat } = useManagedApplicationActions(clubId);

  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, {
    enabled: !hasNoRecruitment,
  });

  if (hasNoRecruitment) {
    return (
      <div className="flex flex-col gap-9 px-4.75 py-4.25">
        <ManagerInfoCard type="detail" />
        <div className="border-indigo-5 flex items-center justify-center rounded-2xl border bg-white px-4 py-10">
          <p className="text-body2 font-medium text-indigo-300">현재 진행 중인 모집 공고가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9 px-4.75 py-4.25">
      <ManagerInfoCard type="detail" />

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
              onChat={handleChat}
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
