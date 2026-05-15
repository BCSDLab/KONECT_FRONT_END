import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authQueries } from '@/apis/auth/queries';
import Card from '@/components/common/Card';

function UserAvatar({ imageUrl, name }: { imageUrl: string; name: string }) {
  if (imageUrl) {
    return (
      <img
        className="border-indigo-5 size-12 rounded-full border object-cover"
        src={imageUrl}
        alt={`${name} 프로필 이미지`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="bg-primary-200 text-primary-800 text-sub1 flex size-12 items-center justify-center rounded-full font-semibold"
    >
      {name.charAt(0)}
    </div>
  );
}

function UserInfoCard() {
  const navigate = useNavigate();
  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());

  const handleCardClick = () => {
    navigate('/profile');
  };

  return (
    <Card className="active:bg-indigo-5/50 cursor-pointer gap-0 rounded-2xl p-3" onClick={handleCardClick}>
      <div className="flex items-center gap-3">
        <UserAvatar imageUrl={myInfo.imageUrl} name={myInfo.name} />
        <div className="min-w-0">
          <div className="text-sub1 truncate font-semibold text-indigo-700">{myInfo.name}</div>
          <div className="text-sub2 mt-1 truncate text-indigo-300">
            {myInfo.studentNumber} · {myInfo.universityName}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UserInfoCard;
