import type { ReactNode } from 'react';
import ChatIcon from '@/assets/svg/chat.svg';
import RightArrowIcon from '@/assets/svg/Chevron-left-dark.svg';

type MyPageRowIcon = typeof ChatIcon;

interface MyPageRowBaseProps {
  icon: MyPageRowIcon;
  label: string;
}

interface MyPageRowLayoutProps extends MyPageRowBaseProps {
  rightSlot: ReactNode;
  labelClassName: string;
}

type MyPageLinkRowProps = MyPageRowBaseProps;

interface MyPageInfoRowProps extends MyPageRowBaseProps {
  value: string;
}

type MyPageActionRowProps = MyPageRowBaseProps;

function MyPageRowLayout({ icon: Icon, label, rightSlot, labelClassName }: MyPageRowLayoutProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-4">
        <Icon />
        <div className={labelClassName}>{label}</div>
      </div>
      {rightSlot}
    </div>
  );
}

export function MyPageLinkRow({ icon, label }: MyPageLinkRowProps) {
  return <MyPageRowLayout icon={icon} label={label} rightSlot={<RightArrowIcon />} labelClassName="text-sub2" />;
}

export function MyPageInfoRow({ icon, label, value }: MyPageInfoRowProps) {
  return (
    <MyPageRowLayout
      icon={icon}
      label={label}
      rightSlot={<div className="text-[13px] leading-4 text-indigo-200">{value}</div>}
      labelClassName="text-sm leading-4 font-semibold"
    />
  );
}

export function MyPageActionRow({ icon, label }: MyPageActionRowProps) {
  return (
    <MyPageRowLayout icon={icon} label={label} rightSlot={null} labelClassName="text-sm leading-4 font-semibold" />
  );
}
