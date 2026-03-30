type BridgeMessage =
  | { type: 'TOKEN_REFRESH'; accessToken: string }
  | { type: 'LOGIN_COMPLETE'; accessToken: string }
  | { type: 'LOGOUT' };

export function postNativeMessage(message: BridgeMessage): void {
  try {
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  } catch {
    // 브릿지 전달 실패가 앱 흐름을 중단시키지 않도록 무시
  }
}
