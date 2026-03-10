import { Link } from 'react-router-dom';
import type { Notice } from '@/apis/council/entity';

function CouncilNoticeCard({ id, isRead, title, createdAt }: Notice) {
  return (
    <Link
      to={`/council/notice/${id}`}
      key={id}
      className="block rounded-lg border border-[#f4f6f9] bg-white px-3 py-3 shadow-[0_0_3px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-1">
        <div className="truncate text-[16px] leading-[1.6] font-semibold text-indigo-700">{title}</div>
        {!isRead && <div className="h-1 w-1 rounded-full bg-[#ff4e4e]" />}
      </div>
      <div className="text-[14px] leading-[1.6] font-medium text-indigo-300">{createdAt}</div>
    </Link>
  );
}

export default CouncilNoticeCard;
