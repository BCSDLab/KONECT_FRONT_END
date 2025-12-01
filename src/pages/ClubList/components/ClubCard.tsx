import type { Club } from '@/apis/club/entity';

interface ClubCardProps {
  club: Club;
}

function ClubCard({ club }: ClubCardProps) {
  return (
    <div className="border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3">
      <img src={club.imageUrl} className="border-indigo-5 h-13 w-13 rounded-sm border" alt={club.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <div className="text-[17px] leading-5 font-bold text-indigo-700">{club.name}</div>
          <div className="text-[11px] leading-3 text-indigo-300">{club.categoryName}</div>
        </div>
        <div className="mt-0.5 truncate text-[13px] leading-4 text-indigo-300">{club.description}</div>
        <div className="mt-1 flex gap-2.5">
          {club.tags.map((tag) => (
            <div
              key={tag}
              className="bg-indigo-5 xs:text-[11px] flex items-center rounded-sm px-1.5 py-[3px] text-[9px] text-indigo-300"
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClubCard;
