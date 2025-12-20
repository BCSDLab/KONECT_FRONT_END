import { Fragment } from 'react/jsx-runtime';
import CopyIcon from '@/assets/svg/copy.svg';
import Card from '@/components/common/Card';

interface AccountInfo {
  amount: number;
  bank: string;
  accountHolder: string;
  accountNumber: string;
}

interface AccountInfoCardProps {
  accountInfo: AccountInfo;
}

function AccountInfoCard({ accountInfo }: AccountInfoCardProps) {
  const items = [
    { label: '은행', value: accountInfo.bank },
    { label: '예금주', value: accountInfo.accountHolder },
    { label: '계좌번호', value: accountInfo.accountNumber },
  ];

  return (
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
        onClick={() => navigator.clipboard.writeText(accountInfo.accountNumber)}
        className="bg-primary text-indigo-0 flex items-center justify-center gap-1.5 rounded-sm py-3 text-xs font-medium"
      >
        <CopyIcon /> 계좌번호 복사하기
      </button>
    </Card>
  );
}

export default AccountInfoCard;
