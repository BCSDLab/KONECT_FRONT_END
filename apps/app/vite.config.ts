import { createKonectViteConfig } from '@konect/vite-config';

export default createKonectViteConfig({
  analyzerFileName: 'docs/perf/assets/bundle-stats.html',
  appDirUrl: import.meta.url,
  port: 3000,
});
