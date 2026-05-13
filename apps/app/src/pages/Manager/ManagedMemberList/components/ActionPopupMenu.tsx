import Portal from '@/components/common/Portal';
import { cn } from '@/utils/ts/cn';

const ACTION_MENU_WIDTH = 148;
const ACTION_MENU_OFFSET = 8;
const ACTION_MENU_MARGIN = 16;

export interface MenuAnchor {
  bottom: number;
  right: number;
  top: number;
}

export interface PopupMenuItem {
  label: string;
  onClick: () => void;
  tone?: 'danger' | 'default';
}

interface ActionPopupMenuProps {
  anchor: MenuAnchor | null;
  isOpen: boolean;
  items: PopupMenuItem[];
  onClose: () => void;
}

export default function ActionPopupMenu({ anchor, isOpen, items, onClose }: ActionPopupMenuProps) {
  if (!isOpen || !anchor) return null;

  const popupHeight = 24 + items.length * 22 + Math.max(0, items.length - 1) * 8;
  const left = Math.min(
    Math.max(anchor.right - ACTION_MENU_WIDTH, ACTION_MENU_MARGIN),
    window.innerWidth - ACTION_MENU_WIDTH - ACTION_MENU_MARGIN
  );
  const top =
    anchor.bottom + ACTION_MENU_OFFSET + popupHeight <= window.innerHeight - ACTION_MENU_MARGIN
      ? anchor.bottom + ACTION_MENU_OFFSET
      : Math.max(ACTION_MENU_MARGIN, anchor.top - popupHeight - ACTION_MENU_OFFSET);

  return (
    <Portal>
      <div className="fixed inset-0 z-100" onClick={onClose}>
        <div
          role="menu"
          aria-orientation="vertical"
          className="border-text-200 fixed w-37 overflow-hidden rounded-[10px] border bg-white p-3"
          style={{ left, top }}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            {items.map(({ label, onClick, tone = 'default' }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={onClick}
                className={cn(
                  'text-sub2 text-left leading-[1.6]',
                  tone === 'danger' ? 'text-danger-600' : 'text-text-600'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}
