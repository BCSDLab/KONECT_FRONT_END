import { Activity, useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { clubQueries } from '@/apis/club/queries';
import useScrollToTop from '@/utils/hooks/useScrollToTop';
import ClubAccount from './components/ClubAccount';
import ClubIntro from './components/ClubIntro';
import ClubMemberTab from './components/ClubMember';
import ClubRecruit from './components/ClubRecruitment';

const SCROLL_RESTORE_KEY = 'clubList_shouldRestore';

type TabType = 'recruitment' | 'intro' | 'members' | 'account';

function ClubDetail() {
  useScrollToTop();
  const { clubId } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from === 'clubList') {
      sessionStorage.setItem(SCROLL_RESTORE_KEY, 'true');
    }
  }, [location.state]);

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const clubIdNumber = Number(clubId);

  const { data: clubDetail } = useSuspenseQuery(clubQueries.detail(clubIdNumber));

  const handleTabClick = (tab: TabType) => {
    setSearchParams({ tab }, { replace: true });
  };

  if (!clubDetail) {
    return <div>잘못된 경로입니다</div>;
  }

  const tabs: { key: TabType; label: string; show: boolean }[] = [
    { key: 'recruitment', label: '모집', show: clubDetail.recruitment.status !== 'CLOSED' },
    { key: 'intro', label: '소개', show: true },
    { key: 'members', label: '인원', show: clubDetail.isMember },
    { key: 'account', label: '계좌', show: clubDetail.isMember || clubDetail.isApplied },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);
  const currentTab = visibleTabs.some((tab) => tab.key === requestedTab)
    ? (requestedTab as TabType)
    : (visibleTabs.find((tab) => tab.key === 'intro')?.key ?? visibleTabs[0]?.key ?? 'intro');

  return (
    <div className="bg-indigo-5 min-h-full">
      <div className="overflow-hidden rounded-b-[20px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-start gap-3 px-4 pb-4">
          <img
            className="border-indigo-5 size-16 rounded-sm border object-cover"
            src={clubDetail.imageUrl}
            alt={clubDetail.name}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="truncate text-[20px] leading-5.5 font-extrabold text-black">{clubDetail.name}</div>
            <div className="text-body3 text-black">{clubDetail.categoryName}</div>
            <div className="text-sub2 truncate text-black">{clubDetail.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-4">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(tab.key)}
              className={clsx(
                'text-sub2 h-9.5 border-b-[1.6px] px-3 transition-colors',
                currentTab === tab.key ? 'border-[#69BFDF] text-[#69BFDF]' : 'border-transparent text-indigo-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 px-5 pt-3 pb-[calc(var(--sab)+20px)]">
        {clubDetail.recruitment.status !== 'CLOSED' && (
          <Activity mode={currentTab === 'recruitment' ? 'visible' : 'hidden'}>
            <ClubRecruit
              clubId={clubIdNumber}
              isMember={clubDetail.isMember}
              presidentUserId={clubDetail.presidentUserId}
            />
          </Activity>
        )}
        <Activity mode={currentTab === 'intro' ? 'visible' : 'hidden'}>
          <ClubIntro clubDetail={clubDetail} />
        </Activity>
        {clubDetail.isMember && (
          <Activity mode={currentTab === 'members' ? 'visible' : 'hidden'}>
            <ClubMemberTab memberCount={clubDetail.memberCount} />
          </Activity>
        )}
        {(clubDetail.isMember || clubDetail.isApplied) && (
          <Activity mode={currentTab === 'account' ? 'visible' : 'hidden'}>
            <ClubAccount />
          </Activity>
        )}
      </div>
    </div>
  );
}

export default ClubDetail;
