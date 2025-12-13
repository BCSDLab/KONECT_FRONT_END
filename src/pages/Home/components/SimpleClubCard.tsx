import { Link } from 'react-router-dom';
import type { JoinClub } from '@/apis/club/entity';
import WarningIcon from '@/assets/svg/warning.svg';

interface SimpleClubCardProps {
  club: JoinClub;
}

function SimpleClubCard({ club }: SimpleClubCardProps) {
  return (
    <Link
      to={`/clubs/${club.id}`}
      className="border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3"
    >
      <img src={club.imageUrl} className="border-indigo-5 h-13 w-13 rounded-sm border" alt={club.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="leading-4.5 font-bold text-indigo-700">{club.name}</div>
            {club.position !== '일반 회원' && (
              <div className="text-indigo-0 flex items-center rounded-sm bg-[#3182F6] px-1 py-0.5 text-[10px] leading-3">
                운영진
              </div>
            )}
          </div>
          {!club.isFeePaid && (
            <div className="flex items-center rounded-full bg-[#FFE5E5E5] px-3 py-1.5 text-[10px] leading-3 font-semibold text-[#FF4E4E]">
              <WarningIcon />
              납부할 회비가 있어요
            </div>
          )}
        </div>
        <div className="mt-1 text-[11px] leading-3 text-indigo-300">
          {club.position}·{club.categoryName}
        </div>
      </div>
    </Link>
  );
}

export default SimpleClubCard;
