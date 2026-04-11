type TimerDisplayPlatform = 'android' | 'ios' | 'web';

const IOS_TIMER_BRIGHTNESS_LEVEL = 0.35;
const ANDROID_TIMER_BRIGHTNESS_LEVEL = 0.28;

function getTimerDisplayPlatform(userAgent = navigator.userAgent): TimerDisplayPlatform {
  if (!window.ReactNativeWebView) return 'web';

  if (/Android/i.test(userAgent)) {
    return 'android';
  }

  if (/(iPhone|iPad|iPod|CPU OS)/i.test(userAgent)) {
    return 'ios';
  }

  return 'web';
}

export function getTimerDisplayMode() {
  const platform = getTimerDisplayPlatform();

  return {
    keepAwake: true,
    dimScreen: true,
    brightnessLevel: platform === 'android' ? ANDROID_TIMER_BRIGHTNESS_LEVEL : IOS_TIMER_BRIGHTNESS_LEVEL,
  } as const;
}
