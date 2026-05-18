import { hasNativeBridge } from '@/utils/ts/nativeBridge';

type TimerDisplayPlatform = 'android' | 'ios' | 'web';

const TIMER_BRIGHTNESS_LEVEL_BY_PLATFORM: Partial<Record<TimerDisplayPlatform, number>> = {
  android: 0.1,
  ios: 0.1,
};

function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

function getTimerDisplayPlatform(): TimerDisplayPlatform {
  if (!isBrowserEnvironment() || !hasNativeBridge()) return 'web';

  const { userAgent } = navigator;

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
    brightnessLevel: TIMER_BRIGHTNESS_LEVEL_BY_PLATFORM[platform],
  } as const;
}
