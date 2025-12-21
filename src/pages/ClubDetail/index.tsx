import { Activity } from 'react';
import clsx from 'clsx';
import { useParams, useSearchParams } from 'react-router-dom';
import useScrollToTop from '@/utils/hooks/useScrollToTop';
import ClubAccount from './components/ClubAccount';
import ClubIntro from './components/ClubIntro';
import ClubMemberTab from './components/ClubMember';
import ClubRecruit from './components/ClubRecruitment';
import { useGetClubDetail } from './hooks/useGetClubDetail';

type TabType = 'recruitment' | 'intro' | 'members' | 'account';

function ClubDetail() {
  useScrollToTop();
  const { clubId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'recruitment';

  const { data: clubDetail } = useGetClubDetail(Number(clubId));

  const handleTabClick = (tab: TabType) => {
    setSearchParams({ tab }, { replace: true });
  };

  const tabs: { key: TabType; label: string; show: boolean }[] = [
    { key: 'recruitment', label: '모집', show: clubDetail.recruitment.status !== 'CLOSED' },
    { key: 'intro', label: '소개', show: true },
    { key: 'members', label: '인원', show: clubDetail.isMember },
    { key: 'account', label: '계좌', show: clubDetail.isMember || clubDetail.isApplied },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);

  if (!clubDetail) {
    return <div>잘못된 경로입니다</div>;
  }

  return (
    <>
      <div className="fixed right-0 left-0 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-4 p-4">
          <img
            className="border-indigo-5 h-16 w-16 rounded-sm border"
            src={clubDetail.imageUrl}
            alt={clubDetail.name}
          />
          <div>
            <div className="mb-1 text-xl leading-5.5 font-black">{clubDetail.name}</div>
            <div className="mb-1 text-[10px] leading-3">{clubDetail.categoryName}</div>
            <div className="text-sm leading-3.5">{clubDetail.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-3">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={clsx(
                'relative h-[38px] px-3 py-1 text-sm leading-5 font-medium transition-colors',
                currentTab === tab.key
                  ? 'text-indigo-700 after:absolute after:bottom-0 after:left-0 after:h-[1.6px] after:w-full after:bg-indigo-300'
                  : 'text-indigo-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-35 flex flex-col gap-2 p-3">
        {clubDetail.recruitment.status !== 'CLOSED' && (
          <Activity mode={currentTab === 'recruitment' ? 'visible' : 'hidden'}>
            <ClubRecruit clubId={Number(clubId)} />
          </Activity>
        )}
        <Activity mode={currentTab === 'intro' ? 'visible' : 'hidden'}>
          <ClubIntro clubDetail={clubDetail} />
        </Activity>
        {clubDetail.isMember && (
          <Activity mode={currentTab === 'members' ? 'visible' : 'hidden'}>
            <ClubMemberTab />
          </Activity>
        )}
        {(clubDetail.isMember || clubDetail.isApplied) && (
          <Activity mode={currentTab === 'account' ? 'visible' : 'hidden'}>
            <ClubAccount />
          </Activity>
        )}
      </div>
    </>
  );
}

export default ClubDetail;
