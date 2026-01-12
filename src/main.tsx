import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// 1) SW 등록 해제 + 컨트롤 해제
async function nukeServiceWorkerAndCaches() {
  // caches API 지원 여부 체크 (일부 환경에서 undefined)
  const hasCaches = typeof caches !== 'undefined';

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));

      // 기존 SW가 이 페이지를 계속 컨트롤하면, unregister만으로 즉시 반영이 안 될 수 있어서
      // 컨트롤이 끊기도록 기다렸다가 리로드하는게 안전함
      // (특히 웹뷰/모바일에서 체감 큼)
    }
  } catch (e) {
    console.error('SW unregister error:', e);
  }

  try {
    if (hasCaches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    console.error('Caches cleanup error:', e);
  }
}

// 2) 딱 한 번만 실행되게(무한 리로드 방지)
(async () => {
  const FLAG = '__sw_cache_nuked__';

  if (!sessionStorage.getItem(FLAG)) {
    sessionStorage.setItem(FLAG, '1');

    await nukeServiceWorkerAndCaches();

    // 캐시/컨트롤 상태가 정리된 뒤 새로고침 1회
    // (새로고침을 해야 "SW로부터 자유로운" 최신 네트워크 로드가 확실해짐)
    location.reload();
    return;
  }

  // 여기부터 정상 앱 렌더
  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <App />
      </StrictMode>
    </QueryClientProvider>
  );
})();
