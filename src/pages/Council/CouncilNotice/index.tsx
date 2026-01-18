import { useParams } from 'react-router-dom';
import { useGetCouncilNoticeDetail } from './hooks/useCouncilNoticeDetail';

function CouncilNotice() {
  const { noticeId } = useParams();
  const { data: councilNoticeDetail } = useGetCouncilNoticeDetail({ noticeId: Number(noticeId) });

  if (!councilNoticeDetail) {
    return <div>공지사항을 불러올 수 없습니다.</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-indigo-0 border-indigo-5 border-b px-5 py-4">
        <div className="leading-5 font-semibold text-indigo-700">{councilNoticeDetail.title}</div>
        <div className="mt-2 text-xs leading-3.5 text-indigo-300">{councilNoticeDetail.updatedAt}</div>
      </div>
      <div className="bg-indigo-0 flex-1 px-5 pt-4 pb-20 text-[13px] leading-4.5 whitespace-pre-line text-indigo-700">
        {councilNoticeDetail.content.replace(/\\n/g, '\n')}
      </div>
    </div>
  );
}

export default CouncilNotice;
