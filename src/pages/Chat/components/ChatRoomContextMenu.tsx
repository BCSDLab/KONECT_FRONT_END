import { useRef } from 'react';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';
import { cn } from '@/utils/ts/cn';

interface MenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ChatRoomContextMenuProps {
  x: number;
  y: number;
  title: string;
  items: MenuItem[];
  onClose: () => void;
}

export default function ChatRoomContextMenu({ x, y, title, items, onClose }: ChatRoomContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickTouchOutside(menuRef, onClose);

  const menuWidth = 160;
  const menuItemHeight = 44;
  const menuHeight = items.length * menuItemHeight;

  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      ref={menuRef}
      className="bg-text-100/80 fixed z-50 h-[159px] w-[161px] overflow-hidden rounded-xl py-3 shadow-lg"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="truncate px-4 py-3 text-[14px] font-bold text-indigo-900">{title}</div>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={cn(
            'active:bg-indigo-5 w-full px-4 py-2.5 text-left text-[14px] font-medium',
            item.danger ? 'text-red-500' : 'text-indigo-700'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
