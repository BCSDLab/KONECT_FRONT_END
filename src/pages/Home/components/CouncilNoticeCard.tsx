import { Link } from 'react-router-dom';

function CouncilNoticeCard({
  id,
  isRead,
  title,
  createdAt,
}: {
  id: number;
  isRead: boolean;
  title: string;
  createdAt: string;
}) {
  return (
    <Link
      to={`/council/notice/${id}`}
      key={id}
      className="bg-indigo-0 border-indigo-5 block rounded-lg border-b px-5 py-4"
    >
      <div className="flex items-center gap-1">
        <div className="text-h3 leading-[15px] font-semibold text-indigo-700">{title}</div>
        {!isRead && <div className="h-1 w-1 rounded-full bg-[#ff4e4e]" />}
      </div>
      <div className="text-sub2 text-indigo-300">{createdAt}</div>
    </Link>
  );
}

export default CouncilNoticeCard;
