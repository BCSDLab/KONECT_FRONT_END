import RecentClubList from '@/components/RecentClubList';

interface UniversityClubSidebarProps {
  university: {
    imageUrl: string;
    name: string;
    campusName?: string;
  };
  clubCount: number;
}

function UniversityClubSidebar({ university, clubCount }: UniversityClubSidebarProps) {
  const universityLabel = university.campusName ? `${university.name} ${university.campusName}` : university.name;

  return (
    <aside className="flex flex-col gap-6 lg:gap-10">
      <section className="border-text-100 flex items-center justify-center rounded-4xl border bg-white py-8 text-center sm:rounded-[40px] sm:py-10">
        <div className="flex min-w-0 flex-col items-center gap-3">
          <img className="h-16 w-12.5 object-contain" src={university.imageUrl} alt="" />
          <div className="flex max-w-full flex-col items-center leading-10">
            <h1 className="max-w-full truncate text-[24px] font-semibold text-black">{universityLabel}</h1>
            <p className="text-text-400 text-[20px]">{clubCount}개 동아리</p>
          </div>
        </div>
      </section>

      <section className="border-text-100 rounded-4xl border bg-white px-3 py-7 sm:rounded-[40px] sm:px-6 sm:py-11">
        <h2 className="text-text-600 text-[20px] leading-10 font-medium">최근에 본 동아리</h2>
        <RecentClubList className="mt-5 flex flex-col gap-5" />
      </section>
    </aside>
  );
}

export default UniversityClubSidebar;
