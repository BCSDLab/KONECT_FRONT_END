import { Link } from 'react-router-dom';
import type { AppliedClub } from '@/apis/club/entity';
import CircleWarningIcon from '@/assets/svg/circle-warning.svg';
import { formatIsoDateToYYYYMMDD } from '@/utils/ts/date';

interface SimpleAppliedClubCardProps {
  club: AppliedClub;
}

function SimpleAppliedClubCard({ club }: SimpleAppliedClubCardProps) {
  return (
    <Link
      to={`/clubs/${club.id}`}
      className="border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3"
    >
      <img src={club.imageUrl} className="border-indigo-5 h-13 w-13 rounded-sm border" alt={club.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center justify-between gap-1">
            <div className="text-h3 text-indigo-700">{club.name}</div>
            <div className="text-cap1 flex items-center gap-0.5 rounded-full bg-[#E8EBEFE5] px-3 py-1 text-[#5A6B7F]">
              <CircleWarningIcon />
              승인 대기 중
            </div>
          </div>
        </div>
        <div className="text-sub2 mt-1 text-indigo-300">지원일: {formatIsoDateToYYYYMMDD(club.appliedAt)}</div>
      </div>
    </Link>
  );
}

export default SimpleAppliedClubCard;
