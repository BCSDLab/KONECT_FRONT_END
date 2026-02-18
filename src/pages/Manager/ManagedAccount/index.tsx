import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ClubFeeRequest } from '@/apis/club/entity';
import BottomModal from '@/components/common/BottomModal';
import type { ApiError } from '@/interface/error';
import { useGetBanks, useManagedClubFee, useManagedClubFeeMutation } from '@/pages/Manager/hooks/useManagedFee';

function ManagedAccount() {
  const { clubId } = useParams<{ clubId: string }>();
  const clubIdNumber = Number(clubId);
  const { managedClubFee } = useManagedClubFee(clubIdNumber);
  const { banks } = useGetBanks();
  const { mutate, isPending, error } = useManagedClubFeeMutation(clubIdNumber);

  const initialBankId = banks.find((bank) => bank.name === managedClubFee.bankName)?.id ?? null;

  const [amount, setAmount] = useState(managedClubFee.amount?.toString() ?? '');
  const [selectedBankId, setSelectedBankId] = useState<number | null>(initialBankId);
  const [selectedBank, setSelectedBank] = useState(managedClubFee.bankName ?? '');
  const [accountHolder, setAccountHolder] = useState(managedClubFee.accountHolder ?? '');
  const [accountNumber, setAccountNumber] = useState(managedClubFee.accountNumber ?? '');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const isFormValid =
    amount.trim() !== '' &&
    Number(amount) > 0 &&
    selectedBankId !== null &&
    accountHolder.trim() !== '' &&
    accountNumber.trim() !== '';

  const handleSubmit = () => {
    if (isPending || !isFormValid || selectedBankId === null) return;

    const payload: ClubFeeRequest = {
      amount: amount,
      bankId: selectedBankId,
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
    };
    mutate(payload);
  };

  const hasChanges = () =>
    amount !== (managedClubFee.amount?.toString() ?? '') ||
    selectedBank !== (managedClubFee.bankName ?? '') ||
    accountHolder !== (managedClubFee.accountHolder ?? '') ||
    accountNumber !== (managedClubFee.accountNumber ?? '');

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col gap-6 overflow-auto p-5">
        <h2 className="text-h3 text-indigo-500">회비 정보</h2>

        <div className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">가입비</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="가입비를 입력해주세요"
            className="bg-indigo-5 w-full rounded-lg p-2 text-[15px] leading-6 font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">은행</label>
          <button
            type="button"
            onClick={() => setIsBankModalOpen(true)}
            className={`bg-indigo-5 w-full rounded-lg p-2 text-left text-[15px] leading-6 font-semibold ${
              selectedBank ? 'text-indigo-700' : 'text-indigo-100'
            }`}
          >
            {selectedBank || '은행을 선택해주세요'}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">예금주</label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="예금주를 입력해주세요"
            className="bg-indigo-5 w-full rounded-lg p-2 text-[15px] leading-6 font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">계좌번호</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="계좌번호를 입력해주세요"
            className="bg-indigo-5 w-full rounded-lg p-2 text-[15px] leading-6 font-semibold"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3" style={{ marginBottom: 'calc(20px + var(--sab))' }}>
        {error && (
          <p className="text-sm text-red-500">
            {(error as ApiError).apiError?.fieldErrors?.[0]?.message ??
              error.message ??
              '회비 정보 저장에 실패했습니다.'}
          </p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !hasChanges() || !isFormValid}
          className="bg-primary w-full rounded-lg py-3 text-center text-lg leading-7 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isPending ? '저장 중...' : '저장하기'}
        </button>
      </div>

      <BottomModal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)}>
        <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
          <h3 className="text-h3 text-center font-bold">은행 선택</h3>
          <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto">
            {banks?.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => {
                  setSelectedBankId(bank.id);
                  setSelectedBank(bank.name);
                  setIsBankModalOpen(false);
                }}
                className="bg-indigo-5 hover:bg-indigo-10 flex items-center gap-2 rounded-lg p-3 transition-colors"
              >
                {bank.imageUrl && <img src={bank.imageUrl} alt={bank.name} className="h-8 w-8 object-contain" />}
                <span className="text-sub2">{bank.name}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedAccount;
