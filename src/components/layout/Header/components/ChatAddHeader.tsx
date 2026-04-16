import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';

interface ChatListHeaderProps {
  title: string;
  onConfirm: () => void;
}

export default function ChatAddHeader({ title, onConfirm }: ChatListHeaderProps) {
  const confirm = (
    <button type="button" onClick={onConfirm}>
      <span className="text-primary-500">확인</span>
    </button>
  );

  return (
    <BackTitleHeader
      title={title}
      rightSlot={confirm}
      headerClassName="h-13 rounded-b-3xl px-4 py-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]"
      rightSlotContainerClassName="flex items-center gap-2"
    />
  );
}
