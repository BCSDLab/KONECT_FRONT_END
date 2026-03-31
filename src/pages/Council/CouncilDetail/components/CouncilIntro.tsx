import type { ComponentType, ReactNode, SVGProps } from 'react';
import type { CouncilResponse } from '@/apis/council/entity';
import ClockIcon from '@/assets/svg/clock.svg';
import InstagramIcon from '@/assets/svg/instagram.svg';
import LocationPinIcon from '@/assets/svg/location-pin.svg';
import Card from '@/components/common/Card';

interface CouncilIntroProps {
  councilDetail: CouncilResponse;
}

function CouncilIntro({ councilDetail }: CouncilIntroProps) {
  const cardClassName = 'rounded-2xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.03)]';
  const contactItemClassName = 'text-text-800 text-[13px] leading-[1.6] font-semibold';
  const contactItems: {
    content: ReactNode;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    key: string;
  }[] = [
    {
      content: councilDetail.location,
      icon: LocationPinIcon,
      key: 'location',
    },
    {
      content: councilDetail.operatingHour,
      icon: ClockIcon,
      key: 'operatingHour',
    },
    {
      content: (
        <a
          href={`https://instagram.com/${councilDetail.instagramUserName}`}
          target="_blank"
          rel="noreferrer"
          className={`${contactItemClassName} underline`}
        >
          @{councilDetail.instagramUserName}
        </a>
      ),
      icon: InstagramIcon,
      key: 'instagram',
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Card className={cardClassName}>
        <div className="text-xs leading-4 whitespace-pre-line text-indigo-300">
          {councilDetail.introduce.replace(/\\n/g, '\n')}
        </div>
      </Card>

      <Card className={cardClassName}>
        <div className="text-text-700 leading-[1.6] font-semibold">위치 및 연락처</div>
        <div className="flex flex-col gap-2">
          {contactItems.map(({ content, icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-1">
              <div className="flex size-8 items-center justify-center">
                <Icon className="text-primary-500" />
              </div>
              {typeof content === 'string' ? <div className={contactItemClassName}>{content}</div> : content}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CouncilIntro;
