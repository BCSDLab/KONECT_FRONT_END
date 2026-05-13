import { Link } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';

interface StatusCardProps {
  icon: React.ComponentType;
  title: string;
  content: React.ReactNode;
  to: string;
}

function StatusCard({ icon: Icon, title, content, to }: StatusCardProps) {
  return (
    <Link to={to} className="block transition-opacity active:opacity-70">
      <Card className="relative">
        <div className="flex items-center gap-3">
          <div className="shrink-0 [&>svg]:h-9 [&>svg]:w-9">
            <Icon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-sm leading-4 font-bold text-indigo-700">{title}</h3>
            </div>
            <div className="text-xs leading-4 text-indigo-300">{content}</div>
          </div>
          <div className="shrink-0 text-indigo-100">
            <RightArrowIcon />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default StatusCard;
