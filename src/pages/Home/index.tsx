import CouncilNoticeSection, {
  CouncilNoticeSectionErrorFallback,
  CouncilNoticeSectionSkeleton,
} from '@/pages/Home/components/CouncilNoticeSection';
import HomeClubSection, {
  HomeClubSectionErrorFallback,
  HomeClubSectionSkeleton,
} from '@/pages/Home/components/HomeClubSection';
import ScheduleSection, {
  ScheduleSectionErrorFallback,
  ScheduleSectionSkeleton,
} from '@/pages/Home/components/ScheduleSection';
import SectionAsyncBoundary from '@/pages/Home/components/SectionAsyncBoundary';
import StudyTimerBanner from '@/pages/Home/components/StudyTimerBanner';

function Home() {
  return (
    <div className="flex flex-col gap-8 px-3 pt-5 pb-6">
      <section>
        <SectionAsyncBoundary fallback={<HomeClubSectionSkeleton />} errorFallback={<HomeClubSectionErrorFallback />}>
          <HomeClubSection />
        </SectionAsyncBoundary>
      </section>

      <section aria-label="행사 배너">
        <StudyTimerBanner />
      </section>

      <section>
        <SectionAsyncBoundary fallback={<ScheduleSectionSkeleton />} errorFallback={<ScheduleSectionErrorFallback />}>
          <ScheduleSection />
        </SectionAsyncBoundary>
      </section>

      <section>
        <SectionAsyncBoundary
          fallback={<CouncilNoticeSectionSkeleton />}
          errorFallback={<CouncilNoticeSectionErrorFallback />}
        >
          <CouncilNoticeSection />
        </SectionAsyncBoundary>
      </section>
    </div>
  );
}

export default Home;
