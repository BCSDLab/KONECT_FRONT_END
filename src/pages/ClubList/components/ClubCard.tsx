import type { Club } from '@/apis/club/entity';

interface ClubCardProps {
  club: Club;
}

function ClubCard({ club }: ClubCardProps) {
  return (
    <div className="flex w-full items-start gap-3 rounded-lg bg-white p-3 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)]">
      <img src={club.imageUrl} className="h-13 w-13 rounded-sm border border-[#f4f6f9]" alt={club.name} />
      <div>
        <div className="flex items-center gap-1">
          <div className="text-[15px] leading-5 font-extrabold text-[#021730]">{club.name}</div>
          <div className="text-[10px] leading-3 text-[#5a6b7f]">{club.categoryName}</div>
        </div>
        <div className="mt-0.5 text-xs leading-4 text-[#5a6b7f]">{club.description}</div>
        <div className="mt-1 flex gap-2.5">
          {club.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center rounded-sm bg-[#f4f6f9] px-1.5 py-[3px] text-[10px] text-[#5a6b7f]"
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
