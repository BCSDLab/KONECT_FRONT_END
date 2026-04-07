import { useRef } from 'react';
import useOutsideTapDismiss from '@/utils/hooks/useOutsideTapDismiss';
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
const MENU_WIDTH = 161;
const MENU_ITEM_HEIGHT = 44;
const MENU_HEADER_HEIGHT = 27;
const MENU_VERTICAL_PADDING = 24;

export default function ChatRoomContextMenu({ x, y, title, items, onClose }: ChatRoomContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideTapDismiss(menuRef, onClose);

  const menuHeight = MENU_HEADER_HEIGHT + MENU_VERTICAL_PADDING + items.length * MENU_ITEM_HEIGHT;

  const adjustedX = x + MENU_WIDTH > window.innerWidth ? x - MENU_WIDTH : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      ref={menuRef}
      className="bg-text-100/80 fixed z-50 w-[161px] overflow-hidden rounded-xl py-3 shadow-lg"
      style={{ left: adjustedX, top: adjustedY, height: menuHeight }}
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
