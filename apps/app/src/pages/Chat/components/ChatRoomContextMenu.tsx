import { useLayoutEffect, useRef } from 'react';
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
const MENU_WIDTH = 160;

export default function ChatRoomContextMenu({ x, y, title, items, onClose }: ChatRoomContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideTapDismiss(menuRef, onClose);

  useLayoutEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const menuHeight = menu.getBoundingClientRect().height;
    const adjustedX = x + MENU_WIDTH > window.innerWidth ? x - MENU_WIDTH : x;
    const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

    menu.style.left = `${adjustedX}px`;
    menu.style.top = `${adjustedY}px`;
  }, [items, x, y, title]);

  const clickItemHandler = (item: MenuItem) => () => {
    item.onClick();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="bg-text-100/80 fixed z-50 w-40 overflow-hidden rounded-xl px-5 py-4"
      style={{ left: x, top: y }}
    >
      <div className="text-text-900 truncate pb-4 text-[14px] leading-[1.6] font-bold">{title}</div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={clickItemHandler(item)}
            className={cn(
              'active:bg-indigo-5 w-full text-left text-[14px] leading-[1.6] font-semibold',
              item.danger ? 'text-red-500' : 'text-text-700'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
