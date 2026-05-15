import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';

interface ChatListHeaderProps {
  disabled?: boolean;
  title: string;
  onConfirm: () => void;
}

export default function ChatAddHeader({ disabled = false, title, onConfirm }: ChatListHeaderProps) {
  const confirmButton = (
    <button
      type="button"
      onClick={onConfirm}
      disabled={disabled}
      className="text-primary-500 disabled:text-primary-300"
    >
      확인
    </button>
  );

  return (
    <BackTitleHeader
      title={title}
      rightSlot={confirmButton}
      headerClassName="h-13 rounded-b-3xl px-4 py-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]"
      rightSlotContainerClassName="flex items-center gap-2"
    />
  );
}
