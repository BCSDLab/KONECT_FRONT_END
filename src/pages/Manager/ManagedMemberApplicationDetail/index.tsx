import { useParams } from 'react-router-dom';
import Portal from '@/components/common/Portal';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { formatIsoDateToYYYYMMDDHHMM } from '@/utils/ts/date';
import { useGetManagedMemberApplicationDetailByUser } from '../hooks/useManagedApplications';

function ManagedMemberApplicationDetail() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const userId = Number(params.userId);

  const { managedClubMemberApplicationDetail: application } = useGetManagedMemberApplicationDetailByUser(
    clubId,
    userId
  );
  const { value: isImageOpen, setTrue: openImage, setFalse: closeImage } = useBooleanState();

  if (!application) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-body2 text-indigo-300">해당 회원의 동아리 지원 내역이 없습니다.</p>
      </div>
    );
  }

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
              <div className="text-sub4 text-gray-500">
                지원일: {formatIsoDateToYYYYMMDDHHMM(application.appliedAt)}
              </div>
            </div>
          </div>
        </section>

        {application.feePaymentImageUrl && (
          <section className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <span className="text-h4">회비 납부 인증</span>
            <div className="flex justify-center">
              <button type="button" onClick={openImage} className="h-52 w-36 overflow-hidden rounded-xl">
                <img src={application.feePaymentImageUrl} alt="회비 납부 인증" className="h-full w-full object-cover" />
              </button>
            </div>
          </section>
        )}

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

      {isImageOpen && application.feePaymentImageUrl && (
        <Portal>
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80" onClick={closeImage}>
            <img
              src={application.feePaymentImageUrl}
              alt="회비 납부 인증"
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </Portal>
      )}
    </div>
  );
}

export default ManagedMemberApplicationDetail;
