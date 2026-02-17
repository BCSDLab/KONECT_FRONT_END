import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ClubFeeRequest } from '@/apis/club/entity';
import BottomModal from '@/components/common/BottomModal';
import type { ApiError } from '@/interface/error';
import DatePicker from '@/pages/Manager/components/DatePicker';
import { useGetBanks, useManagedClubFee, useManagedClubFeeMutation } from '@/pages/Manager/hooks/useManagedFee';

function ManagedAccount() {
  const { clubId } = useParams<{ clubId: string }>();
  const { managedClubFee } = useManagedClubFee(Number(clubId));
  const { banks } = useGetBanks();
  const { mutate, isPending, error } = useManagedClubFeeMutation(Number(clubId));

  const [isFeeEnabled, setIsFeeEnabled] = useState(true);
  const [amount, setAmount] = useState(managedClubFee.amount?.toString() || '');
  const [selectedBankId, setSelectedBankId] = useState<number | null>(managedClubFee.bankId ?? null);
  const [selectedBank, setSelectedBank] = useState(managedClubFee.bank || '');
  const [accountHolder, setAccountHolder] = useState(managedClubFee.accountHolder || '');
  const [accountNumber, setAccountNumber] = useState(managedClubFee.accountNumber || '');
  const [deadLine, setDeadLine] = useState(managedClubFee.deadLine || '');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const handleSubmit = () => {
    const payload: ClubFeeRequest = isFeeEnabled
      ? {
          bankId: selectedBankId,
          amount: Number(amount) || 0,
          bank: selectedBank,
          accountNumber,
          accountHolder,
          deadLine,
        }
      : {
          bankId: null,
          amount: 0,
          bank: '',
          accountNumber: '',
          accountHolder: '',
          deadLine: '',
        };
    mutate(payload);
  };

  const hasChanges = () => {
    if (!managedClubFee) return true;
    const currentHasFee = !!(managedClubFee.amount || managedClubFee.bank || managedClubFee.accountNumber);
    if (currentHasFee !== isFeeEnabled) return true;
    if (!isFeeEnabled) return false;
    return (
      amount !== (managedClubFee.amount?.toString() || '') ||
      selectedBank !== (managedClubFee.bank || '') ||
      accountHolder !== (managedClubFee.accountHolder || '') ||
      accountNumber !== (managedClubFee.accountNumber || '') ||
      deadLine !== (managedClubFee.deadLine || '')
    );
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col gap-6 overflow-auto p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 font-bold text-indigo-500">회비 정보</h2>
          <div className="flex items-center gap-2">
            <span className="text-[15px] leading-6 font-medium text-indigo-300">회비 유무</span>
            <button
              type="button"
              onClick={() => setIsFeeEnabled(!isFeeEnabled)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                isFeeEnabled ? 'bg-primary' : 'bg-indigo-100'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  isFeeEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {isFeeEnabled && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[15px] leading-6 font-medium text-indigo-300">가입비</label>
              <input
                type="number"
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
                className="bg-indigo-5 w-full rounded-lg p-2 text-left text-[15px] leading-6 font-semibold"
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

            <div className="flex flex-col gap-1">
              <label className="text-[15px] leading-6 font-medium text-indigo-300">마감기한</label>
              <DatePicker
                selectedDate={deadLine ? new Date(deadLine.replace(/\./g, '-')) : new Date()}
                onChange={(date) =>
                  setDeadLine(
                    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
                  )
                }
                triggerType="default"
                renderTrigger={(toggle) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="bg-indigo-5 w-full rounded-lg p-2 text-left text-[15px] leading-6 font-semibold"
                  >
                    {deadLine || '마감기한을 선택해주세요'}
                  </button>
                )}
              />
            </div>
          </>
        )}
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
          disabled={isPending || !hasChanges()}
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
