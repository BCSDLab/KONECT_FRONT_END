import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useBottomSheet, type SheetPosition } from '@/utils/hooks/useBottomSheet';

interface BottomSheetProps {
  /** children으로 ReactNode 또는 render prop 함수 전달 가능 */
  children: ReactNode | ((position: SheetPosition) => ReactNode);
  /** 드래그로 크기 조절 가능 여부 (기본값: false) */
  resizable?: boolean;
  /** 초기 위치 (기본값: 'half') */
  defaultPosition?: SheetPosition;
  /** 하단 오프셋 (px) */
  bottomOffset?: number;
  /** half 상태일 때 상단 오프셋 (px) */
  halfTopOffset?: number;
  /** full 상태일 때 상단 오프셋 (px) */
  fullTopOffset?: number;
  /** 추가 className */
  className?: string;
  /** 현재 position을 외부로 전달하는 콜백 */
  onPositionChange?: (position: SheetPosition) => void;
}

export default function BottomSheet({
  children,
  resizable = false,
  defaultPosition = 'half',
  bottomOffset = 0,
  halfTopOffset = 105,
  fullTopOffset = 48,
  className,
  onPositionChange,
}: BottomSheetProps) {
  const { position, isDragging, currentTranslate, sheetRef, handlers } = useBottomSheet({
    defaultPosition,
    onPositionChange,
  });

  const effectivePosition = resizable ? position : defaultPosition;

  const getTransform = () => {
    if (resizable) {
      return effectivePosition === 'half'
        ? `translateY(calc(55% + ${currentTranslate}px))`
        : `translateY(${Math.max(0, currentTranslate)}px)`;
    }
    return effectivePosition === 'half' ? 'translateY(55%)' : 'translateY(0)';
  };

  const content = typeof children === 'function' ? children(effectivePosition) : children;

  return (
    <div
      role="region"
      aria-label="Bottom Sheet"
      ref={sheetRef}
      className={clsx(
        'fixed inset-x-0 z-20 flex flex-col rounded-t-3xl bg-white transition-transform duration-300 ease-out',
        resizable && isDragging && 'transition-none',
        className
      )}
      style={{
        bottom: `${bottomOffset}px`,
        height:
          effectivePosition === 'full'
            ? `calc(100% - ${fullTopOffset}px - ${bottomOffset}px)`
            : `calc(100% - ${halfTopOffset}px - ${bottomOffset}px)`,
        transform: getTransform(),
      }}
    >
      {resizable && (
        <div className="flex h-5 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing" {...handlers}>
          <div className="h-1 w-11 rounded-full bg-indigo-300" />
        </div>
      )}
      {content}
    </div>
  );
}
