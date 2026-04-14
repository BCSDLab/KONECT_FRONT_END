type BridgeMessage =
  | { type: 'TOKEN_REFRESH'; accessToken: string }
  | { type: 'LOGIN_COMPLETE'; accessToken: string }
  | { type: 'LOGOUT' }
  | {
      type: 'TIMER_ACTIVE';
      keepAwake: boolean;
      dimScreen: boolean;
      brightnessLevel?: number;
    }
  | { type: 'TIMER_INACTIVE' }
  | { type: 'NAVIGATE_BACK' };

interface TimerDisplayModeOptions {
  brightnessLevel?: number;
  dimScreen?: boolean;
  keepAwake?: boolean;
}

export function postNativeMessage(message: BridgeMessage): void {
  try {
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  } catch {
    // 브릿지 전달 실패가 앱 흐름을 중단시키지 않도록 무시
  }
}

export function syncTimerDisplayMode(isRunning: boolean, options: TimerDisplayModeOptions = {}): void {
  if (isRunning) {
    postNativeMessage({
      type: 'TIMER_ACTIVE',
      keepAwake: options.keepAwake ?? true,
      dimScreen: options.dimScreen ?? true,
      brightnessLevel: options.brightnessLevel,
    });
    return;
  }

  postNativeMessage({ type: 'TIMER_INACTIVE' });
}

export function requestNativeBackNavigation(): void {
  postNativeMessage({ type: 'NAVIGATE_BACK' });
}
