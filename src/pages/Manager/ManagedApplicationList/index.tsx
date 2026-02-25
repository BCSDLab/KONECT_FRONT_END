import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@/components/common/Card';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import { formatIsoDateToYYYYMMDDHHMM } from '@/utils/ts/date';
import {
  useApproveApplication,
  useRejectApplication,
  useGetManagedApplications,
} from '../hooks/useManagedApplications';

function ManagedApplicationList() {
  const params = useParams();
  const navigate = useNavigate();
  const clubId = Number(params.clubId);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { managedClubApplicationList, hasNoRecruitment } = useGetManagedApplications(clubId, page, limit);

  const { mutate: approve, isPending: isApproving } = useApproveApplication(clubId);
  const { mutate: reject, isPending: isRejecting } = useRejectApplication(clubId);

  const isPending = isApproving || isRejecting;

  const total = managedClubApplicationList?.totalCount ?? 0;
  const totalPages = managedClubApplicationList?.totalPage ?? 1;
  const currentPage = managedClubApplicationList?.currentPage ?? page;

  const handleApprove = (e: React.MouseEvent, applicationId: number) => {
    e.stopPropagation();
    approve(applicationId);
  };

  const handleReject = (e: React.MouseEvent, applicationId: number) => {
    e.stopPropagation();
    reject(applicationId);
  };

  const handleDetail = (applicationId: number) => {
    navigate(`${applicationId}`);
  };

  if (hasNoRecruitment) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <UserInfoCard type="detail" />
        <div className="flex items-center justify-center py-10">
          <p className="text-body2 text-indigo-300">현재 진행 중인 모집 공고가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <UserInfoCard type="detail" />

      <Card className="text-body3 flex-row">
        <div className="bg-indigo-5 flex-1 rounded-sm p-2 text-center">지원자 수 : {total}명</div>
      </Card>

      <div className="flex flex-col gap-2">
        {managedClubApplicationList?.applications.map((application) => (
          <Card
            key={application.id}
            className="flex-row items-center gap-2"
            onClick={() => handleDetail(application.id)}
          >
            <div className="flex flex-1 items-center gap-2">
              <img className="h-10 w-10 rounded-full" src={application.imageUrl} alt="Member Avatar" />
              <div>
                <div className="text-body2 text-indigo-700">
                  {application.name} <span className="text-body3">({application.studentNumber})</span>
                </div>
                <div className="text-cap1 text-indigo-300">
                  지원일 : {formatIsoDateToYYYYMMDDHHMM(application.appliedAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleApprove(e, application.id)}
                disabled={isPending}
                className="flex h-8 w-8 items-center justify-center rounded-full text-green-600 hover:bg-green-200 disabled:opacity-50"
              >
                O
              </button>

              <button
                type="button"
                onClick={(e) => handleReject(e, application.id)}
                disabled={isPending}
                className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-200 disabled:opacity-50"
              >
                X
              </button>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-indigo-100 px-3 py-1 disabled:opacity-50"
          >
            이전
          </button>

          <span className="text-body3 font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded bg-indigo-100 px-3 py-1 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default ManagedApplicationList;
