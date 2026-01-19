import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BigCheckIcon from '@/assets/svg/big-check.svg';
import CheckIcon from '@/assets/svg/check.svg';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import { useSignupStore } from '@/stores/signupStore';
import { AgreementAllRow, AgreementRow } from './components/AgreementArrow';

function TermStep() {
  const navigate = useNavigate();
  const { isTermsAgreement, isPrivacyAgreement, isMarketingAgreement, update } = useSignupStore();

  const [terms, setTerms] = useState(isTermsAgreement);
  const [privacy, setPrivacy] = useState(isPrivacyAgreement);
  const [marketing, setMarketing] = useState(isMarketingAgreement);

  const allChecked = terms && privacy && marketing;
  const requiredChecked = terms && privacy;

  const toggleAll = (next: boolean) => {
    setTerms(next);
    setPrivacy(next);
    setMarketing(next);
  };

  const handleNext = () => {
    update({
      isTermsAgreement: terms,
      isPrivacyAgreement: privacy,
      isMarketingAgreement: marketing,
    });
    navigate('university');
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5" style={{ marginBottom: 'calc(32px + var(--sab))' }}>
      <div className="flex flex-col gap-2 text-center">
        <div className="text-[28px] font-extrabold">서비스 이용 동의</div>
        <div className="font-semibold text-indigo-300">원활한 서비스 이용을 위해 동의해주세요</div>

        <div className="mt-10 flex w-full flex-col gap-3">
          <AgreementAllRow
            checked={allChecked}
            onChange={toggleAll}
            label="전체 동의하기"
            BigCheckIcon={BigCheckIcon}
          />

          <div className="h-px bg-indigo-100" />

          <AgreementRow
            checked={terms}
            onChange={setTerms}
            label="[필수] 서비스 이용약관"
            route="/legal/terms"
            CheckIcon={CheckIcon}
            RightIcon={RightArrowIcon}
          />

          <AgreementRow
            checked={privacy}
            onChange={setPrivacy}
            label="[필수] 개인정보 처리방침"
            route="/legal/privacy"
            CheckIcon={CheckIcon}
            RightIcon={RightArrowIcon}
          />

          <AgreementRow
            checked={marketing}
            onChange={setMarketing}
            label="[선택] 마케팅 정보 수신"
            route="/legal/marketing"
            CheckIcon={CheckIcon}
            RightIcon={RightArrowIcon}
          />
        </div>
      </div>

      <button
        className="bg-primary text-indigo-0 h-12 w-full items-center rounded-lg font-extrabold disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!requiredChecked}
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
}

export default TermStep;
