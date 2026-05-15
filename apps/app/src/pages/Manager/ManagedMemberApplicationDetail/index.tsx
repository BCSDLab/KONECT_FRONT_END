import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { managedClubQueries } from '@/apis/club/managedQueries';
import ApplicationDetailContent from '@/pages/Manager/components/ApplicationDetailContent';

function ManagedMemberApplicationDetail() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const userId = Number(params.userId);

  const { data: application } = useSuspenseQuery(managedClubQueries.memberApplicationDetail(clubId, userId));

  if (!application) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-body2 text-indigo-300">해당 회원의 동아리 지원 내역이 없습니다.</p>
      </div>
    );
  }

  return <ApplicationDetailContent application={application} />;
}

export default ManagedMemberApplicationDetail;
