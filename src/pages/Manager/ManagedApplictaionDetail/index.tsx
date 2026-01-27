import { useParams } from 'react-router-dom';
import CheckIcon from '@/assets/svg/check.svg';
import WarningIcon from '@/assets/svg/warning.svg';
import { formatIsoDateToYYYYMMDD } from '@/utils/ts/date';
import { useApplicationApprove, useApplicationReject, useManagedClubApplicationDetail } from '../hooks/useManagerQuery';

function ManagedApplicationDetail() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const applicationId = Number(params.applicationId);

  const { managedClubApplicationDetail: application } = useManagedClubApplicationDetail(clubId, applicationId);
  const { mutate: approve, isPending: isApproving } = useApplicationApprove(clubId, { navigateBack: true });
  const { mutate: reject, isPending: isRejecting } = useApplicationReject(clubId, { navigateBack: true });

  const isPending = isApproving || isRejecting;

  const handleApprove = () => {
    approve(application.applicationId);
  };

  const handleReject = () => {
    reject(application.applicationId);
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
          onClick={handleReject}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white py-3 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <WarningIcon className="h-5 w-5" />
          <span>{isRejecting ? '거절 중...' : '거절'}</span>
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="bg-primary flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          <CheckIcon className="h-5 w-5" />
          <span>{isApproving ? '승인 중...' : '승인'}</span>
        </button>
      </div>
    </div>
  );
}

export default ManagedApplicationDetail;
