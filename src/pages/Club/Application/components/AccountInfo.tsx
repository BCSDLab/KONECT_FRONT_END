import { Fragment } from 'react/jsx-runtime';
import type { ClubFeeResponse } from '@/apis/club/entity';
import CopyIcon from '@/assets/svg/copy.svg';
import Card from '@/components/common/Card';
import Toast from '@/components/common/Toast';
import { useToast } from '@/utils/hooks/useToast';

interface AccountInfoCardProps {
  accountInfo: ClubFeeResponse;
}

function AccountInfoCard({ accountInfo }: AccountInfoCardProps) {
  const { toast, showToast, hideToast } = useToast();
  const items = [
    { label: '은행', value: accountInfo.bankName ?? '-' },
    { label: '예금주', value: accountInfo.accountHolder ?? '-' },
    { label: '계좌번호', value: accountInfo.accountNumber ?? '-' },
  ];

  return (
    <>
      <Card className="gap-4">
        <div className="text-sm leading-4 font-bold text-indigo-700">입금 계좌</div>
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 && <div className="bg-indigo-5 h-px w-full" />}
              <div className="flex justify-between p-1">
                <div className="text-[10px] leading-3 font-medium text-indigo-300">{item.label}</div>
                <div className="text-xs leading-3.5 font-semibold">{item.value}</div>
              </div>
            </Fragment>
          ))}
        </div>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(accountInfo.accountNumber ?? '');
              showToast('계좌번호가 복사되었습니다');
            } catch {
              showToast('복사에 실패했습니다');
            }
          }}
          className="bg-primary text-indigo-0 flex items-center justify-center gap-1.5 rounded-sm py-3 text-xs font-medium"
        >
          <CopyIcon /> 계좌번호 복사하기
        </button>
      </Card>
      <Toast toast={toast} onClose={hideToast} />
    </>
  );
}

export default AccountInfoCard;
