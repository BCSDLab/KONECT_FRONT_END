import type { ReactNode } from 'react';
import { useBottomSheet, type SheetPosition } from '@/utils/hooks/useBottomSheet';
import { cn } from '@/utils/ts/cn';

export type { SheetPosition } from '@/utils/hooks/useBottomSheet';

interface BottomSheetProps {
  /** children으로 ReactNode 또는 render prop 함수 전달 가능 */
  children: ReactNode | ((position: SheetPosition) => ReactNode);
  /** 드래그로 크기 조절 가능 여부 (기본값: false) */
  resizable?: boolean;
  /** 초기 위치 (기본값: 'half') */
  defaultPosition?: SheetPosition;
  /** 외부 제어 위치 */
  position?: SheetPosition;
  /** 하단 오프셋 (px, resizable=false일 때만 적용) */
  bottomOffset?: number | string;
  /** half 상태일 때 상단 오프셋 (px) */
  halfTopOffset?: number;
  /** half 상태일 때 실제 보이는 높이 */
  halfHeight?: number | string;
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
  position: controlledPosition,
  bottomOffset = 0,
  halfTopOffset = 105,
  halfHeight,
  fullTopOffset = 48,
  className,
  onPositionChange,
}: BottomSheetProps) {
  const { position, isDragging, currentTranslate, sheetRef, handlers } = useBottomSheet({
    defaultPosition,
    position: controlledPosition,
    onPositionChange,
  });

  const effectivePosition = resizable ? position : defaultPosition;
  const normalizedBottomOffset = typeof bottomOffset === 'number' ? `${bottomOffset}px` : bottomOffset;
  const normalizedHalfHeight = typeof halfHeight === 'number' ? `${halfHeight}px` : halfHeight;
  const resizableFullHeight = `calc(100% - ${fullTopOffset}px)`;
  const fullHeight = `calc(100% - ${fullTopOffset}px - ${normalizedBottomOffset})`;
  const halfHeightValue = normalizedHalfHeight ?? `calc(100% - ${halfTopOffset}px)`;
  const nonResizableHalfHeight = normalizedHalfHeight ?? `calc(100% - ${halfTopOffset}px - ${normalizedBottomOffset})`;

  const getResizableHeight = () => {
    if (effectivePosition === 'half') {
      return `calc(${halfHeightValue} - ${Math.min(0, currentTranslate)}px)`;
    }

    return `calc(${resizableFullHeight} - ${Math.max(0, currentTranslate)}px)`;
  };

  const getTransform = () => {
    if (resizable) {
      return 'translateY(0)';
    }

    return effectivePosition === 'half' ? 'translateY(55%)' : 'translateY(0)';
  };

  const content = typeof children === 'function' ? children(effectivePosition) : children;

  if (resizable) {
    return (
      <div
        role="region"
        aria-label="Bottom Sheet"
        ref={sheetRef}
        className={cn(
          'fixed inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.03)] will-change-[height]',
          className
        )}
        style={{
          // resizable 바텀시트는 화면 하단에 고정하고, safe area 처리는 내부 레이아웃에서 담당한다.
          bottom: 0,
          height: getResizableHeight(),
          transition: isDragging ? 'none' : 'height 300ms cubic-bezier(0, 0, 0.2, 1)',
        }}
      >
        <div
          className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center pt-3 select-none active:cursor-grabbing"
          {...handlers}
        >
          <div className="bg-text-400 h-1 w-11 rounded-full" />
        </div>
        {content}
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Bottom Sheet"
      ref={sheetRef}
      className={cn(
        'fixed inset-x-0 z-20 flex flex-col rounded-t-3xl bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.03)] transition-transform duration-300 ease-out will-change-transform',
        className
      )}
      style={{
        bottom: normalizedBottomOffset,
        height: effectivePosition === 'full' ? fullHeight : nonResizableHalfHeight,
        transform: getTransform(),
      }}
    >
      {content}
    </div>
  );
}
