import { Link } from 'react-router-dom';

interface SectionTitleProps {
  title: string;
  to: string;
}

function SectionTitle({ title, to }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[16px] leading-[1.6] font-semibold text-black">{title}</h2>
      <Link to={to} className="text-primary-600 text-[14px] leading-[1.6] font-medium">
        더보기
      </Link>
    </div>
  );
}

export default SectionTitle;
