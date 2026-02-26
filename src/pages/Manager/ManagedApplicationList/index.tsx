import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@/components/common/Card';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import { formatIsoDateToYYYYMMDDHHMM } from '@/utils/ts/date';
import {
  useApproveApplication,
  useRejectApplication,
  useGetManagedApplications,
} from '../hooks/useManagedApplications';
import { useGetManagedMemberApplications } from '../hooks/useManagedMemberApplications';

type TabType = 'pending' | 'approved';

function ManagedApplicationList() {
  const params = useParams();
  const navigate = useNavigate();
  const clubId = Number(params.clubId);

  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const limit = 10;

  const { managedClubApplicationList, hasNoRecruitment } = useGetManagedApplications(clubId, pendingPage, limit);
  const { managedClubMemberApplicationList } = useGetManagedMemberApplications(clubId, approvedPage, limit);

  const { mutate: approve, isPending: isApproving } = useApproveApplication(clubId);
  const { mutate: reject, isPending: isRejecting } = useRejectApplication(clubId);

  const isPending = isApproving || isRejecting;

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

  const pendingTotal = managedClubApplicationList?.totalCount ?? 0;
  const approvedTotal = managedClubMemberApplicationList?.totalCount ?? 0;

  const currentList = activeTab === 'pending' ? managedClubApplicationList : managedClubMemberApplicationList;
  const totalPages = currentList?.totalPage ?? 1;
  const currentPage = activeTab === 'pending' ? pendingPage : approvedPage;
  const setPage = activeTab === 'pending' ? setPendingPage : setApprovedPage;

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'pending', label: '대기 중', count: pendingTotal },
    { key: 'approved', label: '승인됨', count: approvedTotal },
  ];

  return (
    <div className="flex flex-col gap-2 p-3">
      <UserInfoCard type="detail" />

      <div className="flex rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'relative flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'text-indigo-700 after:absolute after:bottom-0 after:left-[20%] after:h-0.5 after:w-[60%] after:rounded-full after:bg-indigo-700'
                : 'text-indigo-300'
            )}
          >
            {tab.label}
            <span
              className={clsx(
                'min-w-5 rounded-full px-1.5 py-0.5 text-xs leading-none',
                activeTab === tab.key ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-400'
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {currentList?.applications.map((application) => (
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

            {activeTab === 'pending' && (
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
            )}
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
