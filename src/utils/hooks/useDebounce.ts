// import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
// import type { DependencyList, EffectCallback } from 'react';

// function useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList) {
//   const effectHook = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

//   effectHook(effect, deps);
// }

// const DEBOUNCE_DEFAULT_TIME = 300;

// function useDebouncedCallback<F extends (...args: unknown[]) => ReturnType<F>>(
//   callback: F,
//   debounceTime: number = DEBOUNCE_DEFAULT_TIME
// ) {
//   const timer = useRef<NodeJS.Timeout | null>(null);
//   const callbackRef = useRef(callback);

//   useIsomorphicLayoutEffect(() => {
//     callbackRef.current = callback;
//   }, [callback]);

//   useIsomorphicLayoutEffect(() => {
//     if (timer.current) {
//       clearTimeout(timer.current);
//     }
//   }, []);

//   return useMemo(
//     () =>
//       (...params: Parameters<F>) => {
//         if (timer.current) {
//           clearTimeout(timer.current);
//         }

//         timer.current = setTimeout(() => {
//           callbackRef.current(...params);
//         }, debounceTime);
//       },
//     [debounceTime]
//   );
// }

// export default useDebouncedCallback;
