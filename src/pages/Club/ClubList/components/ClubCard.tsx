import { Link } from 'react-router-dom';
import type { Club } from '@/apis/club/entity';
import CircleWarningIcon from '@/assets/svg/circle-warning.svg';

interface ClubCardProps {
  club: Club;
}

function getDDay(dateString: string): string {
  const datePart = dateString.split('T')[0].split(' ')[0].replace(/-/g, '.');
  const [year, month, day] = datePart.split('.').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return 'D-Day';
  return '마감';
}

function ClubCard({ club }: ClubCardProps) {
  type ClubTag = {
    label: string;
    bgColor: string;
    textColor: string;
  };

  const clubTag: ClubTag | null = (() => {
    if (club.isPendingApproval) {
      return {
        label: '승인대기중',
        bgColor: '#FEF3C7',
        textColor: '#B45309',
      };
    }

    if (club.isAlwaysRecruiting) {
      return {
        label: '상시모집',
        bgColor: '#ECFDF5',
        textColor: '#047857',
      };
    }

    if (club.status === 'ONGOING') {
      return {
        label: getDDay(club.applicationDeadline),
        bgColor: '#EFF6FF',
        textColor: '#1D4ED8',
      };
    }

    return null;
  })();

  return (
    <Link
      to={`/clubs/${club.id}${club.status === 'ONGOING' ? '?tab=recruitment' : ''}`}
      state={{ from: 'clubList' }}
      className="border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3"
    >
      <img src={club.imageUrl} className="border-indigo-5 h-12 w-12 rounded-sm border" alt={club.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="text-h3 text-indigo-700">{club.name}</div>
            <div className="text-cap1 text-indigo-300">{club.categoryName}</div>
          </div>
          {clubTag && (
            <div
              className="text-cap1 flex items-center gap-0.5 rounded-full px-3 py-1"
              style={{
                backgroundColor: clubTag.bgColor,
                color: clubTag.textColor,
              }}
            >
              <CircleWarningIcon style={{ color: clubTag.textColor }} />
              {clubTag.label}
            </div>
          )}
        </div>
        <div className="text-sub2 truncate text-indigo-300">{club.description}</div>
      </div>
    </Link>
  );
}

export default ClubCard;
