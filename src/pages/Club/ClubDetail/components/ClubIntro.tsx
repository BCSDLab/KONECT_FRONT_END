import { useNavigate } from 'react-router-dom';
import type { ClubDetailResponse } from '@/apis/club/entity';
import HumanIcon from '@/assets/svg/human.svg';
import LocationIcon from '@/assets/svg/location.svg';
import PaperPlaneIcon from '@/assets/svg/paper-plane.svg';
import UserCircleIcon from '@/assets/svg/user-circle.svg';
import Card from '@/components/common/Card';
import useChat from '@/pages/Chat/hooks/useChat';

interface ClubIntroProps {
  clubDetail: ClubDetailResponse;
}

function ClubIntro({ clubDetail }: ClubIntroProps) {
  const navigate = useNavigate();
  const { createChatRoom } = useChat();

  const handleInquireClick = async () => {
    const response = await createChatRoom(clubDetail.presidentUserId);
    navigate(`/chats/${response.chatRoomId}`);
  };

  return (
    <>
      <Card>
        <div className="text-h3 text-indigo-700">동아리 소개</div>
        <div className="text-sub2 mt-1.5 whitespace-pre-line text-indigo-300">{clubDetail.introduce}</div>
      </Card>
      <Card>
        <div className="text-sm leading-4 font-bold text-indigo-700">위치 및 회원 수</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <HumanIcon />
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">회원수</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{clubDetail.memberCount}명</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocationIcon />
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">동아리방 위치</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{clubDetail.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserCircleIcon />
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">대표자</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{clubDetail.presidentName}</div>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="text-body3 flex flex-col items-center gap-1 text-indigo-300">
          <div>동아리에 대해 궁금한 점이 있으신가요?</div>
          <div>편하게 문의해주세요!</div>
        </div>
        <button
          type="button"
          onClick={handleInquireClick}
          className="bg-primary text-body3 flex items-center justify-center gap-1 rounded-sm py-3 text-white"
        >
          <PaperPlaneIcon className="text-white" />
          문의하기
        </button>
      </Card>
    </>
  );
}

export default ClubIntro;
