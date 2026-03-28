import { useSuspenseQuery } from '@tanstack/react-query';
import { councilQueries } from '@/apis/council/queries';
import Card from '@/components/common/Card';
import CouncilNoticeCard from '@/pages/Home/components/CouncilNoticeCard';
import SectionErrorFallback from '@/pages/Home/components/SectionErrorFallback';
import SectionTitle from '@/pages/Home/components/SectionTitle';

const COUNCIL_NOTICE_PARAMS = { limit: 3 } as const;

function NoticeCardSkeleton() {
  return (
    <div className="rounded-lg bg-white px-4 py-3 shadow-[0_0_3px_rgba(0,0,0,0.2)]">
      <div className="bg-indigo-25 h-4 w-48 animate-pulse rounded" />
      <div className="bg-indigo-25 mt-3 h-3 w-20 animate-pulse rounded" />
    </div>
  );
}

export function CouncilNoticeSectionSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <SectionTitle title="총동아리연합회" to="/council?tab=notice" />
      <div className="flex flex-col gap-2">
        <NoticeCardSkeleton />
        <NoticeCardSkeleton />
        <NoticeCardSkeleton />
      </div>
    </div>
  );
}

export function CouncilNoticeSectionErrorFallback() {
  return (
    <div className="flex flex-col gap-2">
      <SectionTitle title="총동아리연합회" to="/council?tab=notice" />
      <SectionErrorFallback />
    </div>
  );
}

function CouncilNoticeSection() {
  const { data: councilNoticeData } = useSuspenseQuery(councilQueries.noticesPreview(COUNCIL_NOTICE_PARAMS.limit));
  const allNotices = councilNoticeData.councilNotices;

  return (
    <div className="flex flex-col gap-2">
      <SectionTitle title="총동아리연합회" to="/council?tab=notice" />
      {allNotices.length === 0 ? (
        <Card className="rounded-[20px] border-0 py-5 shadow-[0_0_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center text-center">
            <div className="text-h3 text-indigo-700">등록된 공지사항이 없어요</div>
            <div className="text-sub2 mt-1 text-indigo-300">새로운 공지사항이 등록되면 여기에 표시돼요</div>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {allNotices.map((notice) => (
            <CouncilNoticeCard key={notice.id} {...notice} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CouncilNoticeSection;
