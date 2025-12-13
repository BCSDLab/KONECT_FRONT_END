import { Activity } from 'react';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import useScrollToTop from '@/utils/hooks/useScrollToTop';
import CouncilIntro from './components/CouncilIntro';
import CouncilNotice from './components/CouncilNotice';
import { useGetCouncilInfo } from './hooks/useGetCouncilInfo';

type TabType = 'intro' | 'notice';

function CouncilDetail() {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'intro';

  const { data: councilInfo } = useGetCouncilInfo();

  const handleTabClick = (tab: TabType) => {
    setSearchParams({ tab }, { replace: true });
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'intro', label: '소개' },
    { key: 'notice', label: '공지사항' },
  ];

  if (!councilInfo) {
    return <div>잘못된 경로입니다</div>;
  }

  return (
    <>
      <div
        className="fixed right-0 left-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]"
        style={{ backgroundColor: councilInfo.personalColor }}
      >
        <div className="flex items-center gap-4 p-4">
          <img className="h-14 w-14 rounded-sm" src={councilInfo.imageUrl} alt={councilInfo.name} />
          <div>
            <div className="text-indigo-0 text-xl leading-5.5 font-bold">총동아리연합회</div>
            <div className="text-indigo-0 mt-1 text-sm leading-4.5">{councilInfo.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-3">
          {tabs.map((tab) => (
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
      <Activity mode={currentTab === 'intro' ? 'visible' : 'hidden'}>
        <CouncilIntro councilDetail={councilInfo} />
      </Activity>
      <Activity mode={currentTab === 'notice' ? 'visible' : 'hidden'}>
        <CouncilNotice />
      </Activity>
    </>
  );
}

export default CouncilDetail;
