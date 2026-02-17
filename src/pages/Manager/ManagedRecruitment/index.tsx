import { useState } from 'react';
import CreditCardSmIcon from '@/assets/svg/credit-card-sm.svg';
import CreditCardIcon from '@/assets/svg/credit-card.svg';
import FileSmIcon from '@/assets/svg/file-sm.svg';
import FileIcon from '@/assets/svg/file.svg';
import MegaphoneSmIcon from '@/assets/svg/megaphone-sm.svg';
import MegaphoneIcon from '@/assets/svg/megaphone.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import StatusCard from './components/StatusCard';

function ManagedRecruitment() {
  // TODO: API 연결 시 실제 데이터로 교체
  const [recruitmentEnabled, setRecruitmentEnabled] = useState(true);
  const [applicationEnabled, setApplicationEnabled] = useState(true);
  const [feeEnabled, setFeeEnabled] = useState(false);

  // Mock 데이터 - API 연결 시 실제 데이터로 교체
  const recruitmentContent = recruitmentEnabled
    ? '모집 기간: 2026.02.02 ~ 2027.02.02.'
    : '모집공고가 설정되지 않았습니다.';

  const applicationContent = applicationEnabled ? '문항 3개' : '지원서 양식이 설정되지 않았습니다.';

  const feeContent = feeEnabled ? '20만원 / 무슨 은행' : '회비가 설정되지 않았습니다.';

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <UserInfoCard type="detail" />
      <div className="rounded-lg bg-white p-4">
        <div className="mb-3 text-sm leading-4 font-bold text-indigo-700">설정 관리</div>
        <div className="flex items-center justify-evenly">
          <ToggleSwitch
            icon={MegaphoneSmIcon}
            label="모집공고"
            enabled={recruitmentEnabled}
            onChange={setRecruitmentEnabled}
          />
          <div className="h-14 w-px bg-indigo-50" />
          <ToggleSwitch
            icon={FileSmIcon}
            label="지원서"
            enabled={applicationEnabled}
            onChange={setApplicationEnabled}
          />
          <div className="h-14 w-px bg-indigo-50" />
          <ToggleSwitch icon={CreditCardSmIcon} label="회비" enabled={feeEnabled} onChange={setFeeEnabled} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <StatusCard icon={MegaphoneIcon} title="모집공고" content={recruitmentContent} to="write" />
        <StatusCard icon={FileIcon} title="지원서" content={applicationContent} to="form" />
        <StatusCard icon={CreditCardIcon} title="회비" content={feeContent} to="account" />
      </div>
    </div>
  );
}

export default ManagedRecruitment;
