import { cn } from '@/utils/ts/cn';

interface RouteLoadingFallbackProps {
  fullScreen?: boolean;
}

export default function RouteLoadingFallback({ fullScreen = false }: RouteLoadingFallbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'text-body3 flex w-full items-center justify-center gap-3 text-indigo-400',
        fullScreen ? 'h-(--viewport-height)' : 'min-h-full flex-1 py-10'
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}
