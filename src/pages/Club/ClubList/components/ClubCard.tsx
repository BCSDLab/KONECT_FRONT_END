import { Link } from 'react-router-dom';
import type { Club } from '@/apis/club/entity';

interface ClubCardProps {
  club: Club;
}

function ClubCard({ club }: ClubCardProps) {
  return (
    <Link
      to={`/clubs/${club.id}${club.status === 'ONGOING' ? '?tab=recruitment' : ''}`}
      className="border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3"
    >
      <img src={club.imageUrl} className="border-indigo-5 h-13 w-13 rounded-sm border" alt={club.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="text-h3 text-indigo-700">{club.name}</div>
            <div className="text-cap1 text-indigo-300">{club.categoryName}</div>
          </div>
          {club.status === 'ONGOING' && (
            <div className="text-cap2 flex items-center rounded-sm bg-[#3182f6] px-1 py-0.5 text-center text-white">
              모집중
            </div>
          )}
        </div>
        <div className="text-sub2 mt-0.5 truncate text-indigo-300">{club.description}</div>
        <div className="mt-1 flex gap-1">
          {club.tags.map((tag) => (
            <div
              key={tag}
              className="bg-indigo-5 text-body3 flex items-center rounded-sm px-1.5 py-[3px] text-indigo-300"
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default ClubCard;
