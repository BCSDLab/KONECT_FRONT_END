import { useNavigate, useParams } from 'react-router-dom';
import Card from '@/components/common/Card';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import { formatIsoDateToYYYYMMDD } from '@/utils/ts/date';
import {
  useUpdateApplicationStatus,
  useDeleteApplication,
  useGetManagedApplications,
} from '../hooks/useManagedApplications';

function ManagedApplicationList() {
  const params = useParams();
  const navigate = useNavigate();
  const clubId = Number(params.clubId);

  const { managedClubApplicationList } = useGetManagedApplications(clubId);
  const { mutate: approve, isPending: isApproving } = useUpdateApplicationStatus(clubId);
  const { mutate: reject, isPending: isRejecting } = useDeleteApplication(clubId);

  const total = managedClubApplicationList.applications.length;
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

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <UserInfoCard type="detail" />
      <Card className="text-body3 flex-row">
        <div className="bg-indigo-5 flex-1 rounded-sm p-2 text-center">지원자 수 : {total}명</div>
        {/* <div className="bg-indigo-5 flex-1 rounded-sm p-2 text-center">CSV 추출하기</div> */}
      </Card>
      {managedClubApplicationList.applications.map((application) => (
        <Card key={application.id} className="flex-row items-center gap-2" onClick={() => handleDetail(application.id)}>
          <div className="flex flex-1 items-center gap-2">
            <img className="h-10 w-10 rounded-full" src={application.imageUrl} alt="Member Avatar" />
            <div>
              <div className="text-body2 text-indigo-700">
                {application.name} <span className="text-body3">({application.studentNumber})</span>
              </div>
              <div className="text-cap1 text-indigo-300">지원일 : {formatIsoDateToYYYYMMDD(application.appliedAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleApprove(e, application.id)}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full text-green-600 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              O
            </button>
            <button
              type="button"
              onClick={(e) => handleReject(e, application.id)}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              X
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ManagedApplicationList;
