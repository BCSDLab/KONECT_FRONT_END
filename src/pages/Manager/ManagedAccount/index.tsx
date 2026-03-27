import { useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { ClubFeeRequest } from '@/apis/club/entity';
import { managedClubQueries } from '@/apis/club/managedQueries';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import BottomModal from '@/components/common/BottomModal';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import { useToastContext } from '@/contexts/useToastContext';
import { isApiError } from '@/interface/error';
import {
  usePatchManagedClubSettingsMutation,
  useUpdateManagedClubFeeMutation,
} from '@/pages/Manager/hooks/useManagedClubMutations';
import { cn } from '@/utils/ts/cn';

const cardClassName = 'rounded-2xl bg-white px-5 py-5';
const fieldLabelClassName = 'text-body3-strong text-text-700';
const fieldControlClassName =
  'w-full rounded-lg border border-text-200 bg-white px-3 text-[13px] leading-[20.8px] font-medium text-black outline-none placeholder:text-text-300 focus:border-primary-500';
const fieldInputClassName = `${fieldControlClassName} h-[31px]`;

function ManagedAccount() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const clubIdNumber = Number(clubId);
  const { showToast } = useToastContext();

  const { data: banks } = useSuspenseQuery(managedClubQueries.banks());
  const { data: managedClubFee } = useSuspenseQuery(managedClubQueries.fee(clubIdNumber));
  const { data: clubSettings } = useQuery(managedClubQueries.settings(clubIdNumber));
  const { mutate: updateClubFee, isPending, error } = useUpdateManagedClubFeeMutation(clubIdNumber);
  const { mutate: patchSettings, isPending: isPatchPending } = usePatchManagedClubSettingsMutation(clubIdNumber);

  const initialAmount = managedClubFee.amount?.toString() ?? '';
  const initialBankId = banks.find((bank) => bank.name === managedClubFee.bankName)?.id ?? null;
  const initialBankName = managedClubFee.bankName ?? '';
  const initialAccountHolder = managedClubFee.accountHolder ?? '';
  const initialAccountNumber = managedClubFee.accountNumber ?? '';

  const [amount, setAmount] = useState(initialAmount);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(initialBankId);
  const [selectedBankName, setSelectedBankName] = useState(initialBankName);
  const [accountHolder, setAccountHolder] = useState(initialAccountHolder);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const hasChanges =
    amount !== initialAmount ||
    selectedBankId !== initialBankId ||
    accountHolder !== initialAccountHolder ||
    accountNumber !== initialAccountNumber;

  const isFormValid =
    amount.trim() !== '' && selectedBankId !== null && accountHolder.trim() !== '' && accountNumber.trim() !== '';

  const isFeeEnabled = clubSettings?.isFeeEnabled ?? false;
  const feeStatusLabel = isFeeEnabled ? '활성화' : '비활성화';

  const handleSubmit = () => {
    if (isPending || isPatchPending || !isFormValid || !hasChanges || selectedBankId === null) return;

    const payload: ClubFeeRequest = {
      amount: amount.trim(),
      bankId: selectedBankId,
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
    };

    updateClubFee(payload, {
      onSuccess: () => {
        if (location.state?.enableAfterSave) {
          patchSettings(
            { isFeeEnabled: true },
            {
              onSuccess: () => {
                showToast('회비가 수정되었습니다');
                navigate(-1);
              },
              onError: () => {
                showToast('회비 활성화에 실패했습니다');
              },
            }
          );
          return;
        }

        showToast('회비가 수정되었습니다');
        navigate(-1);
      },
    });
  };

  const handleFeeEnabledChange = (enabled: boolean) => {
    patchSettings({ isFeeEnabled: enabled });
  };

  const errorMessage =
    (isApiError(error) ? error.apiError?.fieldErrors?.[0]?.message : undefined) ??
    error?.message ??
    '회비 정보 저장에 실패했습니다.';

  return (
    <div className="bg-background flex min-h-full flex-col px-4 pt-5">
      <div className="mx-auto flex w-full max-w-[352px] flex-1 flex-col gap-4 pb-[calc(40px+var(--sab))]">
        <div className="flex justify-end">
          <ToggleSwitch
            variant="manager"
            label={feeStatusLabel}
            ariaLabel="회비 활성화 설정"
            enabled={isFeeEnabled}
            onChange={handleFeeEnabledChange}
            disabled={isPatchPending}
            labelClassName="text-text-500"
          />
        </div>

        <section className={cn(cardClassName, 'shadow-[0_0_3px_rgba(0,0,0,0.15)]')}>
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h2 className="text-h3 text-indigo-700">회비정보</h2>
              <div className="h-[22px] w-0" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-1">
              <label className={fieldLabelClassName}>가입비</label>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="가입비를 입력해주세요"
                className={fieldInputClassName}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={fieldLabelClassName}>은행</label>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className={cn(
                  fieldInputClassName,
                  'flex items-center justify-between text-left',
                  selectedBankName ? 'text-black' : 'text-text-300'
                )}
              >
                <span className="truncate">{selectedBankName || '은행을 선택해주세요'}</span>
                <ChevronDownIcon aria-hidden="true" className="text-text-300 size-4 shrink-0" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className={fieldLabelClassName}>예금주</label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="예금주를 입력해주세요"
                className={fieldInputClassName}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={fieldLabelClassName}>계좌번호</label>
              <input
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="계좌번호를 입력해주세요"
                className={fieldInputClassName}
              />
            </div>
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          {error && <p className="text-body3 text-danger-700">{errorMessage}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isPatchPending || !hasChanges || !isFormValid}
            className="bg-primary-500 disabled:bg-text-200 h-12 w-full rounded-2xl text-center text-[18px] leading-[1.6] font-semibold text-white disabled:cursor-not-allowed"
          >
            {isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>

      <BottomModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        overlayClassName="bg-black/30"
        className="max-h-[75vh]"
      >
        <div className="flex flex-col gap-4 px-5 pt-6 pb-[calc(20px+var(--sab))]">
          <h3 className="text-h3 text-center text-indigo-700">은행 선택</h3>
          <div className="grid max-h-[48vh] grid-cols-2 gap-2 overflow-y-auto">
            {banks.map((bank) => {
              const isSelected = bank.id === selectedBankId;

              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => {
                    setSelectedBankId(bank.id);
                    setSelectedBankName(bank.name);
                    setIsBankModalOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition-colors',
                    isSelected ? 'border-primary-500 bg-primary-500/8' : 'border-text-100 bg-white'
                  )}
                >
                  {bank.imageUrl && <img src={bank.imageUrl} alt="" className="size-8 shrink-0 object-contain" />}
                  <span className="text-body3-strong text-text-700">{bank.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedAccount;
