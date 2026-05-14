import type { HTMLAttributes } from 'react';
import { cn } from '@konect/utils/cn';
import {
  DEFAULT_BOTTOM_OVERLAY_GAP,
  type BottomOverlayGap,
  useBottomOverlayOffset,
} from '@/components/layout/bottomOverlay';

interface BottomOverlaySpacerProps extends HTMLAttributes<HTMLDivElement> {
  gap?: BottomOverlayGap;
}

function BottomOverlaySpacer({
  gap = DEFAULT_BOTTOM_OVERLAY_GAP,
  className,
  style,
  ...props
}: BottomOverlaySpacerProps) {
  const height = useBottomOverlayOffset(gap);

  return <div aria-hidden="true" className={cn('shrink-0', className)} style={{ height, ...style }} {...props} />;
}

export default BottomOverlaySpacer;
