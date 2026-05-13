import MiniSchedulePreview, {
  MiniSchedulePreviewErrorFallback,
  MiniSchedulePreviewSkeleton,
} from '@/pages/Home/components/MiniSchedulePreview';
import SectionTitle from '@/pages/Home/components/SectionTitle';

export function ScheduleSectionSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <SectionTitle title="다가오는 일정" to="/schedule" />
      <MiniSchedulePreviewSkeleton />
    </div>
  );
}

export function ScheduleSectionErrorFallback() {
  return (
    <div className="flex flex-col gap-2">
      <SectionTitle title="다가오는 일정" to="/schedule" />
      <MiniSchedulePreviewErrorFallback />
    </div>
  );
}

function ScheduleSection() {
  return (
    <div className="flex flex-col gap-2">
      <SectionTitle title="다가오는 일정" to="/schedule" />
      <MiniSchedulePreview />
    </div>
  );
}

export default ScheduleSection;
