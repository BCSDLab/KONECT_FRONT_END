import { Activity, type CSSProperties } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { councilQueries } from '@/apis/council/queries';
import BottomOverlaySpacer from '@/components/layout/BottomOverlaySpacer';
import useScrollToTop from '@/utils/hooks/useScrollToTop';
import { cn } from '@/utils/ts/cn';
import CouncilIntro from './components/CouncilIntro';
import CouncilNotice from './components/CouncilNotice';

type TabType = 'intro' | 'notice';

function CouncilDetail() {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab: TabType = searchParams.get('tab') === 'notice' ? 'notice' : 'intro';

  const { data: councilInfo } = useSuspenseQuery(councilQueries.info());

  const handleTabClick = (tab: TabType) => {
    setSearchParams({ tab }, { replace: true });
  };
  const getTabId = (tab: TabType) => `tab-${tab}`;
  const getPanelId = (tab: TabType) => `panel-${tab}`;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'intro', label: '소개' },
    { key: 'notice', label: '공지사항' },
  ];
  const backgroundStyle = {
    backgroundImage: `linear-gradient(180deg, ${councilInfo.personalColor} 0%, var(--color-background) 38%, var(--color-background) 100%)`,
    top: 'calc(-1 * var(--subpage-header-height))',
  } satisfies CSSProperties;

  return (
    <div className="relative min-h-full">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0" style={backgroundStyle} />

      <div className="relative z-10">
        <section className="px-4">
          <div className="flex items-center gap-3 p-4">
            <img className="size-15 rounded-sm object-cover" src={councilInfo.imageUrl} alt={councilInfo.name} />
            <div className="flex flex-col gap-1">
              <div className="leading-[1.6] font-semibold text-white">총동아리연합회</div>
              <div className="text-sm leading-[1.6] text-white">{councilInfo.name}</div>
            </div>
          </div>

          <div role="tablist" className="grid grid-cols-2 items-center px-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                id={getTabId(tab.key)}
                role="tab"
                aria-selected={currentTab === tab.key}
                className={cn(
                  'flex h-12 items-center justify-center px-3 text-[15px] leading-5 font-medium transition-colors',
                  currentTab === tab.key ? 'text-primary-500' : 'text-text-600'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <div className="px-4.5 pt-2">
          <Activity mode={currentTab === 'intro' ? 'visible' : 'hidden'}>
            <div role="tabpanel" id={getPanelId('intro')} aria-labelledby={getTabId('intro')}>
              <CouncilIntro councilDetail={councilInfo} />
            </div>
          </Activity>
          <Activity mode={currentTab === 'notice' ? 'visible' : 'hidden'}>
            <div role="tabpanel" id={getPanelId('notice')} aria-labelledby={getTabId('notice')}>
              <CouncilNotice />
            </div>
          </Activity>
          <BottomOverlaySpacer gap={24} />
        </div>
      </div>
    </div>
  );
}

export default CouncilDetail;
