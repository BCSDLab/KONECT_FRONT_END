import { useNavigate, useParams } from 'react-router-dom';
import CreditCardSmIcon from '@/assets/svg/credit-card-sm.svg';
import CreditCardIcon from '@/assets/svg/credit-card.svg';
import FileSmIcon from '@/assets/svg/file-sm.svg';
import FileIcon from '@/assets/svg/file.svg';
import MegaphoneSmIcon from '@/assets/svg/megaphone-sm.svg';
import MegaphoneIcon from '@/assets/svg/megaphone.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import { useGetClubSettings, usePatchClubSettings } from '../hooks/useManagedSettings';
import StatusCard from './components/StatusCard';

function ManagedRecruitment() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { data: settings } = useGetClubSettings(Number(clubId));
  const { mutate: patchSettings } = usePatchClubSettings(Number(clubId));

  const handleRecruitmentToggle = (value: boolean) => {
    if (value && !settings?.recruitment) {
      navigate('write', { state: { enableAfterSave: true } });
      return;
    }
    patchSettings({ isRecruitmentEnabled: value });
  };

  const handleApplicationToggle = (value: boolean) => {
    if (value && (!settings?.application || settings.application.questionCount === 0)) {
      navigate('form', { state: { enableAfterSave: true } });
      return;
    }
    patchSettings({ isApplicationEnabled: value });
  };

  const handleFeeToggle = (value: boolean) => {
    if (value && !settings?.fee) {
      navigate('account', { state: { enableAfterSave: true } });
      return;
    }
    patchSettings({ isFeeEnabled: value });
  };

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

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <UserInfoCard type="detail" />
      <div className="rounded-lg bg-white p-4">
        <div className="mb-3 text-sm leading-4 font-bold text-indigo-700">설정 관리</div>
        <div className="flex items-center justify-evenly">
          <ToggleSwitch
            icon={MegaphoneSmIcon}
            label="모집공고"
            enabled={settings?.isRecruitmentEnabled ?? false}
            onChange={handleRecruitmentToggle}
          />
          <div className="h-14 w-px bg-indigo-50" />
          <ToggleSwitch
            icon={FileSmIcon}
            label="지원서"
            enabled={settings?.isApplicationEnabled ?? false}
            onChange={handleApplicationToggle}
          />
          <div className="h-14 w-px bg-indigo-50" />
          <ToggleSwitch
            icon={CreditCardSmIcon}
            label="회비"
            enabled={settings?.isFeeEnabled ?? false}
            onChange={handleFeeToggle}
          />
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
