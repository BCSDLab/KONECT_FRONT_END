import { useEffect, type ReactNode } from 'react';
import { cn } from '@konect/utils/cn';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { clubDetailQueries } from '@/apis/clubDetail/queries';
import NoneImage from '@/assets/None-image.png';
import AddMovIcon from '@/assets/svg/add-mov-icon.svg';
import AddPhotoIcon from '@/assets/svg/add-photo-icon.svg';
import Breadcrumb from '@/components/Breadcrumb';
import UniversityClubSidebar from '@/components/UniversityClubSidebar';
import { CATEGORY_TEXT_COLORS } from '@/constants/club';
import useResetScroll from '@/utils/hooks/useResetScroll';
import { saveRecentClubId } from '@/utils/recentClubStorage';

const INTRODUCE_MEDIA_ITEMS = [
  { label: '활동 사진', icon: <AddPhotoIcon /> },
  { label: '소개 영상', icon: <AddMovIcon /> },
];

function Introduce({ introduce }: { introduce: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-5">
        {INTRODUCE_MEDIA_ITEMS.map(({ label, icon }) => (
          <IntroduceMediaCard key={label} icon={icon} label={label} />
        ))}
      </div>
      <span className="text-text-500 mt-2.5 text-[20px] leading-10 font-semibold">{introduce}</span>
    </div>
  );
}

function IntroduceMediaCard({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <section className="border-primary-200 flex h-59.5 w-83.25 flex-col items-center justify-center rounded-[20px] border bg-[#F8FAFC]">
      {icon}
      <span className="text-text-400 text-[20px] leading-10">{label}</span>
    </section>
  );
}

function NoneIntroduce() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <img src={NoneImage} alt="" className="size-25" />
      <div className="flex flex-col items-center leading-15">
        <span className="text-text-400 text-[24px]">
          동아리 소개를 준비 중이에요. 동아리 관리자라면 오른쪽 상단의 등록하기를 통해
        </span>
        <span className="text-text-400 text-[24px]">소개 내용을 보내주세요! 확인 후 페이지에 반영해드릴게요.</span>
      </div>
    </div>
  );
}

export default function ClubDetail() {
  const { clubId } = useParams();

  useResetScroll(clubId);

  const { data: clubDetail } = useSuspenseQuery(clubDetailQueries.detail(Number(clubId)));

  useEffect(() => {
    saveRecentClubId(clubDetail.id);
  }, [clubDetail.id]);

  return (
    <main className="min-h-screen text-black">
      <div className="mx-auto mt-12 flex w-full max-w-277.5 flex-col px-5 pb-20 lg:mt-25 xl:px-0">
        <Breadcrumb
          items={[
            { label: '홈', to: '/' },
            { label: '대학교 동아리', to: `/universities/${clubDetail.university.id}/clubs` },
            { label: clubDetail.name },
          ]}
        />
        <div className="mt-10 grid gap-8 md:mt-15 md:grid-cols-[296px_minmax(0,1050px)] lg:gap-10">
          <UniversityClubSidebar university={clubDetail.university} clubCount={clubDetail.university.clubCount} />
          <div className="flex flex-col gap-10">
            <section className="border-text-100 flex flex-col gap-5 rounded-[20px] border bg-white px-11 py-10">
              <div className="flex gap-10 py-[14.5px]">
                <img className="size-22.5 object-cover" src={clubDetail.imageUrl} alt="" />
                <div className="flex flex-col gap-1 leading-10">
                  <h1 className="text-[36px] font-extrabold">{clubDetail.name}</h1>
                  <div className="flex items-center gap-2 text-[20px]">
                    <span className={cn('font-semibold', CATEGORY_TEXT_COLORS[clubDetail.category])}>
                      {clubDetail.categoryName}
                    </span>
                    <span className="bg-text-200 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                    <span className="text-text-600 min-w-0 truncate font-medium">{clubDetail.description}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-10">
                  <h2 className="text-text-500 text-[20px] font-semibold">한줄소개</h2>
                  <p className="text-text-900 text-[20px] font-semibold">{clubDetail.description}</p>
                </div>
              </div>
            </section>
            <section className="border-text-100 flex flex-col gap-2.5 rounded-[20px] border bg-white px-11 py-10">
              <h2 className="text-text-900 text-[24px] font-bold">동아리 소개</h2>
              {clubDetail.introduce ? <Introduce introduce={clubDetail.introduce} /> : <NoneIntroduce />}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
