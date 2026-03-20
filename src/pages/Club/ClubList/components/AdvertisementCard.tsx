import type { Advertisement } from '@/apis/advertisement/entity';
import CircleWarningIcon from '@/assets/svg/circle-warning.svg';

interface AdvertisementCardProps {
  advertisement: Advertisement;
  onClick: (advertisementId: number) => void;
}

function AdvertisementCard({ advertisement, onClick }: AdvertisementCardProps) {
  return (
    <a
      href={advertisement.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick(advertisement.id)}
      className="border-indigo-5 flex w-full items-start gap-3 rounded-2xl border bg-white p-4"
    >
      <img
        src={advertisement.imageUrl}
        alt={advertisement.title}
        className="border-indigo-5 h-12 w-12 rounded-[10px] border object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-h3 truncate text-[#1E2C3F]">{advertisement.title}</div>
          <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-[#EAF6FB] px-3 py-1.5 text-[10px] leading-3 font-semibold text-[#2F6E83]">
            <CircleWarningIcon className="size-3 shrink-0" style={{ color: '#2F6E83' }} />
            광고
          </div>
        </div>
        <div className="text-sub2 truncate text-indigo-300">{advertisement.description}</div>
      </div>
    </a>
  );
}

export default AdvertisementCard;
