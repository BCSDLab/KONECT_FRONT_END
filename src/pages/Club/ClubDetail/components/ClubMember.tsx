import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { ClubMember, PositionType } from '@/apis/club/entity';
import { clubQueries } from '@/apis/club/queries';
import { cn } from '@/utils/ts/cn';

const POSITION_LABELS: Record<PositionType, string> = {
  PRESIDENT: '회장',
  VICE_PRESIDENT: '부회장',
  MANAGER: '임원진',
  MEMBER: '일반 회원',
};

const POSITION_BADGE_STYLES: Partial<Record<PositionType, string>> = {
  PRESIDENT: 'bg-[#69BFDF]',
  VICE_PRESIDENT: 'bg-[#F6DE8C]',
  MANAGER: 'bg-[#FFB8B8]',
};

function ClubMemberAvatar({ imageUrl, name }: Pick<ClubMember, 'imageUrl' | 'name'>) {
  if (imageUrl) {
    return (
      <img
        className="border-indigo-5 size-10 rounded-full border object-cover"
        src={imageUrl}
        alt={`${name} 프로필 이미지`}
      />
    );
  }

  return <div aria-hidden className="bg-indigo-75 size-10 rounded-full" />;
}

const ClubMemberCard = (clubMember: ClubMember) => {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white p-4">
      <ClubMemberAvatar imageUrl={clubMember.imageUrl} name={clubMember.name} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="text-sub2 text-indigo-700">{clubMember.name}</div>
          {clubMember.position !== 'MEMBER' && (
            <div
              className={cn(
                'flex items-center rounded-sm px-1 py-0.5 text-[10px] leading-[1.6] font-semibold text-white',
                POSITION_BADGE_STYLES[clubMember.position]
              )}
            >
              {POSITION_LABELS[clubMember.position]}
            </div>
          )}
        </div>
        <div className="text-body3 text-indigo-300">{clubMember.studentNumber}</div>
      </div>
    </div>
  );
};

interface ClubMemberTabProps {
  memberCount: number;
}

function ClubMemberTab({ memberCount }: ClubMemberTabProps) {
  const { clubId } = useParams();
  const { data: clubMembers } = useSuspenseQuery(clubQueries.members(Number(clubId)));
  const members = clubMembers?.clubMembers ?? [];
  const totalMembers = clubMembers?.clubMembers?.length ?? memberCount;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sub2 text-indigo-300">{totalMembers}명</div>
      <div className="flex flex-col gap-2">
        {members.map((member) => (
          <ClubMemberCard key={member.studentNumber} {...member} />
        ))}
      </div>
    </div>
  );
}

export default ClubMemberTab;
