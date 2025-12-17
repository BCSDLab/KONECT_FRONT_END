import { useParams } from 'react-router-dom';
import type { ClubMember } from '@/apis/club/entity';
import Card from '@/components/common/Card';
import { useGetClubMembers } from '../hooks/useGetClubMembers';

const ClubMemberCard = (clubMember: ClubMember) => {
  return (
    <Card className="flex-row items-center gap-2">
      <img className="h-10 w-10 rounded-full" src={clubMember.imageUrl} alt="Member Avatar" />
      <div>
        <div className="flex gap-1">
          <div className="text-sm leading-4 font-medium text-indigo-700">{clubMember.name}</div>
          {clubMember.position !== '일반 회원' && (
            <div className="text-indigo-0 flex items-center rounded-sm bg-[#3182F6] px-1 py-0.5 text-[10px] leading-3 font-semibold">
              {clubMember.position}
            </div>
          )}
        </div>
        <div className="mt-1 text-xs font-medium text-indigo-300">{clubMember.studentNumber}</div>
      </div>
    </Card>
  );
};

function ClubMemberTab() {
  const { clubId } = useParams();
  const { data: clubMembers } = useGetClubMembers(Number(clubId));
  const totalMembers = clubMembers.clubMembers.length;
  return (
    <>
      <div className="text-sm leading-3.5 text-indigo-300">
        총 <span className="font-bold text-black">{totalMembers}명</span>의 동아리인원
      </div>
      <div className="flex flex-col gap-1.5">
        {clubMembers.clubMembers.map((member) => (
          <ClubMemberCard key={member.studentNumber} {...member} />
        ))}
      </div>
    </>
  );
}

export default ClubMemberTab;
