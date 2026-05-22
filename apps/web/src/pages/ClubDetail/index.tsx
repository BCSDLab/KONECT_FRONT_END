import { cn } from '@konect/utils/cn';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { clubDetailQueries } from '@/apis/clubDetail/queries';
import AddMov from '@/assets/add-mov.svg';
import AddPhoto from '@/assets/add-photo.svg';
import NoneImage from '@/assets/None-image.png';
import { CATEGORY_TEXT_COLORS } from '@/constants/club';

function Introduce({ introduce }: { introduce: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex h-full w-full gap-5">
        <section className="border-primary-200 h-72.5 w-144.5 rounded-[20px] border bg-[#F8FAFC] px-7.5 py-6.5">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <AddPhoto />
            <span className="text-text-400 text-[20px] leading-10">활동 사진</span>
          </div>
        </section>
        <section className="border-primary-200 w-87.25 rounded-[20px] border bg-[#F8FAFC] px-7.5 py-6.5">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <AddMov />
            <span className="text-text-400 text-[20px] leading-10">소개 영상</span>
          </div>
        </section>
      </div>
      <span className="text-text-500 text-[20px] leading-10 font-semibold">{introduce}</span>
    </div>
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

function formatDate(date: string | null) {
  return date?.slice(0, 10) ?? '';
}

export default function ClubDetail() {
  const { clubId } = useParams();
  const { data: clubDetail } = useSuspenseQuery(clubDetailQueries.detail(Number(clubId)));

  const IsAlwaysRecruiting = clubDetail.recruitment.isAlwaysRecruiting;
  const startDate = formatDate(clubDetail.recruitment.startAt);
  const endDate = formatDate(clubDetail.recruitment.endAt);
  const recruitmentPeriod = startDate && endDate ? `${startDate}~${endDate}` : '미정';

  return (
    <main className="bg-web-background min-h-screen text-black">
      <div className="mx-auto flex w-full max-w-369.5 flex-col px-5 pt-12 pb-20 sm:px-8 lg:pt-25.5 xl:px-0">
        <nav className="text-text-400 flex items-center gap-3 text-sm leading-8 font-semibold sm:gap-3.5 sm:text-[24px] sm:leading-10">
          <Link to="/">홈</Link>
          <span className="text-text-300 text-lg sm:text-[20px]">›</span>
          <Link to={`/universities/${clubDetail.university.id}/clubs`}>대학교 동아리</Link>
          <span className="text-text-300 text-lg sm:text-[20px]">›</span>
          <span>{clubDetail.name}</span>
        </nav>
        <div className="mt-10 grid gap-8 lg:mt-15 lg:grid-cols-[407px_minmax(0,1050px)] lg:gap-5">
          <aside className="flex flex-col gap-6 lg:gap-10">
            <section className="border-text-100 flex h-55 items-center justify-center rounded-4xl border bg-white px-8 py-8 text-center sm:h-66 sm:rounded-[40px] sm:px-21 sm:py-10">
              <div className="flex min-w-0 flex-col items-center gap-3">
                <img className="h-22 w-17.5 object-contain" src={clubDetail.university.imageUrl} alt="" />
                <div className="flex max-w-full flex-col items-center leading-10">
                  <h1 className="max-w-full truncate text-[24px] font-semibold text-black">
                    {clubDetail.university.name}
                  </h1>
                  <p className="text-text-400 text-[20px]">{clubDetail.university.clubCount ?? 0}개 동아리</p>
                </div>
              </div>
            </section>
            <section className="border-text-100 rounded-4xl border bg-white px-5 py-7 sm:rounded-[40px] sm:px-10 sm:py-11">
              <h2 className="text-text-600 text-[24px] leading-10 font-medium">최근에 본 동아리</h2>
            </section>
          </aside>
          <div className="flex flex-col gap-10">
            <section className="flex min-h-75 flex-col gap-[37.5px] rounded-4xl bg-white px-11 py-10">
              <div className="flex h-29.75 gap-10">
                <img className="size-22.5 object-cover" src={clubDetail.imageUrl} alt="" />
                <div className="flex flex-col">
                  <h1 className="text-[40px] leading-14 font-bold">{clubDetail.name}</h1>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn('shrink-0 text-[20px] font-semibold', CATEGORY_TEXT_COLORS[clubDetail.category])}
                    >
                      {clubDetail.categoryName}
                    </span>
                    <span className="bg-text-200 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                    <span className="text-text-600 min-w-0 truncate text-[20px] font-medium">
                      {clubDetail.description || `${clubDetail.memberCount}명`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-10">
                  <h2 className="text-text-500 text-[20px] font-semibold">한줄소개</h2>
                  <p className="text-text-900 text-[20px] font-semibold">{clubDetail.description}</p>
                </div>
                <div className="flex gap-10">
                  <h2 className="text-text-500 text-[20px] font-semibold">모집시기</h2>
                  <p className="text-text-900 text-[20px] font-semibold">
                    {IsAlwaysRecruiting ? '상시모집' : recruitmentPeriod}
                  </p>
                </div>
              </div>
            </section>
            <section className="flex min-h-127.5 w-258 flex-col items-start gap-2.5 rounded-4xl bg-white px-10 py-11">
              <h2 className="text-text-900 text-[24px] font-bold">동아리 소개</h2>
              {clubDetail.introduce ? <Introduce introduce={clubDetail.introduce} /> : <NoneIntroduce />}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
