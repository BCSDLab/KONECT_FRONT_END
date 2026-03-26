import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { managedClubQueries } from '@/apis/club/managedQueries';
import cardIcon from '@/assets/image/3d-card.png';
import fileIcon from '@/assets/image/3d-file.png';
import flagIcon from '@/assets/image/3d-flag.png';
import ChevronRightIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';

function ManagedRecruitment() {
  const { clubId } = useParams<{ clubId: string }>();
  const { data: settings } = useQuery(managedClubQueries.settings(Number(clubId)));

  const recruitmentContent = (() => {
    if (!settings?.isRecruitmentEnabled) return '모집공고가 비활성화되어 있습니다.';
    if (!settings.recruitment) return '모집 기간을 설정해 주세요.';
    if (settings.recruitment.isAlwaysRecruiting) return '상시 모집';
    return `모집 기간: ${settings.recruitment.startAt} ~ ${settings.recruitment.endAt}`;
  })();

  const applicationContent = (() => {
    if (!settings?.isApplicationEnabled) return '지원서가 비활성화되어 있습니다.';
    if (!settings.application) return '지원서 문항을 설정해 주세요.';
    return `문항 ${settings.application.questionCount}개`;
  })();

  const feeContent = (() => {
    if (!settings?.isFeeEnabled) return '회비가 비활성화되어 있습니다.';
    if (!settings.fee) return '회비 정보를 설정해 주세요.';
    return `${settings.fee.amount} / ${settings.fee.bankName}`;
  })();

  const rows = [
    { icon: flagIcon, title: '모집 공고', content: recruitmentContent, to: 'write' },
    { icon: fileIcon, title: '지원서', content: applicationContent, to: 'form' },
    { icon: cardIcon, title: '회비', content: feeContent, to: 'account' },
  ];

  return (
    <div className="flex h-full flex-col gap-9 px-[19px] py-[17px]">
      <UserInfoCard type="detail" />
      <Card className="gap-5 rounded-2xl px-4 py-3">
        {rows.map(({ icon, title, content, to }) => (
          <Link key={to} to={to} className="flex items-center gap-3 transition-opacity active:opacity-70">
            <img src={icon} alt="" aria-hidden="true" className="size-7 shrink-0 object-contain" />
            <div className="min-w-0 flex-1">
              <div className="text-sm leading-[1.6] font-semibold text-indigo-700">{title}</div>
              <div className="text-xs leading-[1.6] text-indigo-300">{content}</div>
            </div>
            <ChevronRightIcon className="shrink-0 text-indigo-100" />
          </Link>
        ))}
      </Card>
    </div>
  );
}

export default ManagedRecruitment;
