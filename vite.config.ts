import babel from '@rolldown/plugin-babel';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryRelease = process.env.SENTRY_RELEASE;

const shouldAnalyzeBundle = process.env.ANALYZE === 'true';
const shouldUploadSourcemaps = Boolean(sentryOrg && sentryProject && sentryAuthToken);

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Preserve the Vite 7 browser baseline until we intentionally drop older WebViews.
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    rolldownOptions: {
      plugins: shouldAnalyzeBundle
        ? [
            visualizer({
              brotliSize: true,
              filename: 'docs/perf/assets/bundle-stats.html',
              gzipSize: true,
              open: false,
              template: 'treemap',
            }),
          ]
        : [],
    },
    sourcemap: shouldUploadSourcemaps ? 'hidden' : false,
  },
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    svgr({ include: '**/*.svg' }),
    ...(shouldUploadSourcemaps
      ? [
          sentryVitePlugin({
            org: sentryOrg,
            project: sentryProject,
            authToken: sentryAuthToken,
            telemetry: false,
            release: sentryRelease ? { name: sentryRelease } : undefined,
            sourcemaps: {
              filesToDeleteAfterUpload: ['dist/**/*.map'],
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
