import { Link } from 'react-router-dom';
import type { CouncilResponse } from '@/apis/council/entity';
import ClockIcon from '@/assets/svg/clock.svg';
import InstagramIcon from '@/assets/svg/instagram.svg';
import LocationPinIcon from '@/assets/svg/location-pin.svg';
import Card from '@/components/common/Card';

interface CouncilIntroProps {
  councilDetail: CouncilResponse;
}

function CouncilIntro({ councilDetail }: CouncilIntroProps) {
  return (
    <div className="mt-31.5 flex flex-col gap-2 p-3">
      <Card>
        <div className="mt-1.5 text-xs leading-3.5 whitespace-pre-line text-indigo-300">
          {councilDetail.introduce.replace(/\\n/g, '\n')}
        </div>
      </Card>

      <Card>
        <div className="text-sm leading-4 font-bold text-indigo-700">위치 및 연락처</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#E8EBEF]">
              <LocationPinIcon />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">동아리방 위치</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{councilDetail.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#E8EBEF]">
              <ClockIcon />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">운영 시간</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{councilDetail.operatingHour}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#E8EBEF]">
              <InstagramIcon />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">인스타그램</div>
              <Link to={councilDetail.instagramUrl} className="text-sm leading-3.5 font-semibold text-indigo-700">
                @{councilDetail.instagramUrl.split('/').pop()}
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CouncilIntro;
