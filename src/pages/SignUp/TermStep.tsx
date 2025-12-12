import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BigCheckIcon from '@/assets/svg/big-check.svg';
import CheckIcon from '@/assets/svg/check.svg';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import { AgreementAllRow, AgreementRow } from './components/AgreementArrow';

function TermStep() {
  const navigate = useNavigate();

  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const allChecked = useMemo(() => terms && privacy && marketing, [terms, privacy, marketing]);

  const toggleAll = (next: boolean) => {
    setTerms(next);
    setPrivacy(next);
    setMarketing(next);
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5">
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
            CheckIcon={CheckIcon}
            RightIcon={RightArrowIcon}
          />

          <AgreementRow
            checked={privacy}
            onChange={setPrivacy}
            label="[필수] 개인정보 처리방침"
            CheckIcon={CheckIcon}
            RightIcon={RightArrowIcon}
          />

          <AgreementRow
            checked={marketing}
            onChange={setMarketing}
            label="[선택] 마케팅 정보 수신"
            CheckIcon={CheckIcon}
            RightIcon={RightArrowIcon}
          />
        </div>
      </div>

      <button
        className="bg-primary text-indigo-0 mb-8 h-12 items-center rounded-lg font-extrabold"
        disabled={!allChecked}
        onClick={() => navigate('profile/school')}
      >
        다음
      </button>
    </div>
  );
}

export default TermStep;
