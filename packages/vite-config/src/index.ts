import { fileURLToPath, URL } from 'node:url';

import babel from '@rolldown/plugin-babel';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

interface KonectViteConfigOptions {
  analyzerFileName: string;
  appDirUrl: string;
  port: number;
}

const browserTarget = ['chrome107', 'edge107', 'firefox104', 'safari16'];

export function createKonectViteConfig({ analyzerFileName, appDirUrl, port }: KonectViteConfigOptions) {
  const sentryOrg = process.env.SENTRY_ORG;
  const sentryProject = process.env.SENTRY_PROJECT;
  const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
  const sentryRelease = process.env.SENTRY_RELEASE;

  const shouldAnalyzeBundle = process.env.ANALYZE === 'true';
  const shouldUploadSourcemaps = Boolean(sentryOrg && sentryProject && sentryAuthToken);

  return defineConfig({
    envDir: fileURLToPath(new URL('../..', appDirUrl)),
    build: {
      target: browserTarget,
      rolldownOptions: {
        plugins: shouldAnalyzeBundle
          ? [
              visualizer({
                brotliSize: true,
                filename: analyzerFileName,
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
        '@': fileURLToPath(new URL('./src', appDirUrl)),
      },
    },
    server: {
      port,
    },
    preview: {
      port,
    },
  });
}
