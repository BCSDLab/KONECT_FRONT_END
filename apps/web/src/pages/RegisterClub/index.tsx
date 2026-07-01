import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import EditClub from '@/assets/edit-club-detail.png';
import NewClub from '@/assets/new-club.png';
import Register from '@/assets/register-club.png';

export default function RegisterClub() {
  const registerClubCards = [
    {
      image: EditClub,
      imageAlt: '동아리 정보 수정',
      title: '동아리 정보 수정',
      description: '이미 KONECT에 등록된 동아리의 소개, 사진, 상세정보를 추가하거나 수정할 수 있어요',
      target: '대상 : 동아리 회장, 임원진',
      to: '/clubs/information-update-requests',
    },
    {
      image: NewClub,
      imageAlt: '신규 동아리 등록',
      title: '신규 동아리 등록',
      description: '아직 KONECT에 등록되지 않은 동아리의 기본 정보와 소개 정보를 제출할 수 있어요.',
      target: '대상 : 미등록된 동아리의 관계자',
      to: '/clubs/registration-requests',
    },
    {
      image: Register,
      imageAlt: '학교 동아리 목록 등록',
      title: '학교 동아리 목록 등록',
      description: '총동 / 학생회 담당자가 학교 단위의 동아리 목록과 기본 정보를 한 번에 전달할 수 있어요.',
      target: '대상 : 총동아리 연합회 / 학생회 담당자',
      link: '/register-club/list',
    },
  ];
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-4 py-11.5 sm:px-6 lg:px-0">
      <section className="flex flex-col items-center gap-5">
        <div className="bg-primary-100 border-primary-400 text-primary-500 flex h-16 w-full max-w-74.25 items-center justify-center gap-2.5 rounded-[30px] border-2 px-7.5 py-3 text-[20px] leading-10 font-semibold sm:text-[24px]">
          <span className="bg-primary-500 size-2 rounded-full" aria-hidden="true" />
          동아리 정보 등록/수정
        </div>
        <span className="text-text-400 text-[20px]">
          작성자 유형에 따라 필요한 항목이 다릅니다. 현재 상황에 맞는 항목을 선택해주세요.
        </span>
      </section>
      <section className="flex w-full flex-col gap-5 sm:flex-row sm:flex-wrap sm:justify-center">
        {registerClubCards.map((card) => (
          <RegisterClubCard key={card.title} card={card}>
            <img src={card.image} alt={card.imageAlt} />
            <div className="flex flex-col items-center">
              <h2 className="text-text-700 text-[24px] font-semibold">{card.title}</h2>
              <span className="text-text-600 mt-10 w-65 text-center text-[14px] leading-4">{card.description}</span>
              <span className="text-text-600 pt-5 text-[14px]">{card.target}</span>
            </div>
          </RegisterClubCard>
        ))}
      </section>
    </main>
  );
}

function RegisterClubCard({
  card,
  children,
}: {
  card: {
    description: string;
    image: string;
    imageAlt: string;
    target: string;
    title: string;
    to?: string;
  };
  children: ReactNode;
}) {
  const className =
    'border-text-100 focus-visible:outline-primary-500 flex min-h-92.75 w-full flex-col items-center gap-10 rounded-[20px] border bg-[#ffffff] px-7.5 py-10 transition-[border-color,box-shadow] hover:border-primary-500 hover:shadow-[0_0_30px_0_rgba(105,191,223,0.30)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-82.75';

  if (card.to) {
    return (
      <Link className={className} to={card.to}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}
