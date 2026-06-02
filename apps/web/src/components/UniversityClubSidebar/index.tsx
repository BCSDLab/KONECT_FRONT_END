import RecentClubList from '@/components/RecentClubList';
import { getUniversityLabel } from '@/utils/universityLabel';

interface UniversityClubSidebarProps {
  university: {
    imageUrl: string;
    name: string;
    campusName?: string;
  };
  clubCount: number;
}

function UniversityClubSidebar({ university, clubCount }: UniversityClubSidebarProps) {
  const universityLabel = getUniversityLabel(university);

  return (
    <aside className="flex flex-col gap-6 lg:gap-10">
      <section className="border-text-100 flex items-center justify-center rounded-2xl border bg-white py-8 text-center sm:rounded-[20px] sm:py-7">
        <div className="flex min-w-0 flex-col items-center gap-1">
          <img className="size-10 object-contain" src={university.imageUrl} alt="" />
          <div className="flex max-w-full flex-col items-center">
            <h1 className="max-w-full truncate leading-9 font-semibold text-black">{universityLabel}</h1>
            <p className="text-text-400 text-[13px] leading-6">{clubCount}개 동아리</p>
          </div>
        </div>
      </section>

      <section className="border-text-100 rounded-2xl border bg-white p-3 sm:rounded-[20px] sm:p-5">
        <h2 className="text-text-600 text-[20px] leading-10 font-medium">최근에 본 동아리</h2>
        <RecentClubList className="mt-3 flex flex-col gap-5" />
      </section>
    </aside>
  );
}

export default UniversityClubSidebar;
